from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'default-secret-key')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Stripe Config
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

# Create the main app
app = FastAPI(title="Dublin Study API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class School(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    description_en: str
    address: str
    city: str = "Dublin"
    country: str = "Ireland"
    image_url: str
    rating: float = 4.5
    reviews_count: int = 0
    accreditation: List[str] = []
    facilities: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Course(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    school_id: str
    name: str
    name_en: str
    description: str
    description_en: str
    duration_weeks: int
    hours_per_week: int
    level: str  # beginner, intermediate, advanced
    price: float
    currency: str = "EUR"
    requirements: List[str] = []
    includes: List[str] = []
    start_dates: List[str] = []
    available_spots: int = 20
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Enrollment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_email: str
    user_name: str
    school_id: str
    school_name: str
    course_id: str
    course_name: str
    start_date: str
    price: float
    currency: str = "EUR"
    status: str = "pending"  # pending, paid, confirmed, cancelled
    payment_session_id: Optional[str] = None
    letter_sent: bool = False
    letter_sent_date: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    enrollment_id: str
    amount: float
    currency: str
    status: str = "initiated"  # initiated, pending, paid, failed, expired
    payment_status: str = "pending"
    metadata: Dict[str, str] = {}
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CreateCheckoutRequest(BaseModel):
    enrollment_id: str
    origin_url: str

class BusRoute(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    route_number: str
    name: str
    name_en: str
    from_location: str
    to_location: str
    frequency_minutes: int
    first_bus: str
    last_bus: str
    fare: float
    zones: List[str] = []
    popular_stops: List[str] = []

class GovernmentAgency(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    name_en: str
    description: str
    description_en: str
    category: str  # immigration, civil, public_services, student
    address: str
    phone: str
    email: str
    website: str
    opening_hours: str
    services: List[str] = []

# ============== AUTH HELPERS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
        return user
    except:
        return None

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user)
    
    token = create_token(user_id, user_data.email)
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            name=user_data.name,
            email=user_data.email,
            created_at=user["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    token = create_token(user["id"], user["email"])
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(**user)

# ============== SCHOOLS ROUTES ==============

@api_router.get("/schools", response_model=List[School])
async def get_schools():
    schools = await db.schools.find({}, {"_id": 0}).to_list(100)
    return schools

@api_router.get("/schools/{school_id}", response_model=School)
async def get_school(school_id: str):
    school = await db.schools.find_one({"id": school_id}, {"_id": 0})
    if not school:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    return school

@api_router.get("/schools/{school_id}/courses", response_model=List[Course])
async def get_school_courses(school_id: str):
    courses = await db.courses.find({"school_id": school_id}, {"_id": 0}).to_list(100)
    return courses

# ============== COURSES ROUTES ==============

@api_router.get("/courses", response_model=List[Course])
async def get_courses():
    courses = await db.courses.find({}, {"_id": 0}).to_list(100)
    return courses

@api_router.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    return course

# ============== ENROLLMENT ROUTES ==============

@api_router.post("/enrollments", response_model=Enrollment)
async def create_enrollment(
    course_id: str,
    start_date: str,
    user: dict = Depends(get_current_user)
):
    course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    
    school = await db.schools.find_one({"id": course["school_id"]}, {"_id": 0})
    if not school:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    enrollment = Enrollment(
        user_id=user["id"],
        user_email=user["email"],
        user_name=user["name"],
        school_id=school["id"],
        school_name=school["name"],
        course_id=course["id"],
        course_name=course["name"],
        start_date=start_date,
        price=course["price"],
        currency=course["currency"]
    )
    
    await db.enrollments.insert_one(enrollment.model_dump())
    return enrollment

@api_router.get("/enrollments", response_model=List[Enrollment])
async def get_user_enrollments(user: dict = Depends(get_current_user)):
    enrollments = await db.enrollments.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).to_list(100)
    return enrollments

@api_router.get("/enrollments/{enrollment_id}", response_model=Enrollment)
async def get_enrollment(enrollment_id: str, user: dict = Depends(get_current_user)):
    enrollment = await db.enrollments.find_one(
        {"id": enrollment_id, "user_id": user["id"]}, {"_id": 0}
    )
    if not enrollment:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")
    return enrollment

# ============== PAYMENT ROUTES ==============

@api_router.post("/payments/checkout")
async def create_checkout(
    request: CreateCheckoutRequest,
    http_request: Request,
    user: dict = Depends(get_current_user)
):
    enrollment = await db.enrollments.find_one(
        {"id": request.enrollment_id, "user_id": user["id"]}, {"_id": 0}
    )
    if not enrollment:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")
    
    if enrollment.get("status") == "paid":
        raise HTTPException(status_code=400, detail="Esta matrícula já foi paga")
    
    host_url = str(http_request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    success_url = f"{request.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{request.origin_url}/dashboard"
    
    checkout_request = CheckoutSessionRequest(
        amount=float(enrollment["price"]),
        currency="eur",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "enrollment_id": enrollment["id"],
            "user_id": user["id"],
            "user_email": user["email"],
            "school_name": enrollment["school_name"],
            "course_name": enrollment["course_name"]
        }
    )
    
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = PaymentTransaction(
        session_id=session.session_id,
        user_id=user["id"],
        user_email=user["email"],
        enrollment_id=enrollment["id"],
        amount=float(enrollment["price"]),
        currency="eur",
        status="initiated",
        payment_status="pending",
        metadata={
            "school_name": enrollment["school_name"],
            "course_name": enrollment["course_name"]
        }
    )
    await db.payment_transactions.insert_one(transaction.model_dump())
    
    # Update enrollment with session_id
    await db.enrollments.update_one(
        {"id": enrollment["id"]},
        {"$set": {"payment_session_id": session.session_id}}
    )
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, http_request: Request):
    host_url = str(http_request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Check if already processed
        transaction = await db.payment_transactions.find_one(
            {"session_id": session_id}, {"_id": 0}
        )
        
        if transaction and transaction.get("status") != "paid" and status.payment_status == "paid":
            # Update transaction
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "status": "paid",
                    "payment_status": "paid",
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            
            # Update enrollment
            enrollment_id = transaction.get("enrollment_id")
            if enrollment_id:
                await db.enrollments.update_one(
                    {"id": enrollment_id},
                    {"$set": {"status": "paid"}}
                )
                
                # Mock email notification (logged)
                logger.info(f"📧 EMAIL NOTIFICATION: Payment confirmed for enrollment {enrollment_id}")
                logger.info(f"   To: {transaction.get('user_email')}")
                logger.info(f"   Subject: Pagamento Confirmado - Dublin Study")
        
        return {
            "status": status.status,
            "payment_status": status.payment_status,
            "amount_total": status.amount_total,
            "currency": status.currency
        }
    except Exception as e:
        logger.error(f"Error checking payment status: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            
            transaction = await db.payment_transactions.find_one(
                {"session_id": session_id}, {"_id": 0}
            )
            
            if transaction and transaction.get("status") != "paid":
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {
                        "status": "paid",
                        "payment_status": "paid",
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
                
                enrollment_id = webhook_response.metadata.get("enrollment_id")
                if enrollment_id:
                    await db.enrollments.update_one(
                        {"id": enrollment_id},
                        {"$set": {"status": "paid"}}
                    )
        
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}

# ============== TRANSPORT ROUTES ==============

@api_router.get("/transport/routes", response_model=List[BusRoute])
async def get_bus_routes():
    routes = await db.bus_routes.find({}, {"_id": 0}).to_list(100)
    return routes

# ============== GOVERNMENT SERVICES ROUTES ==============

@api_router.get("/services/agencies", response_model=List[GovernmentAgency])
async def get_agencies():
    agencies = await db.agencies.find({}, {"_id": 0}).to_list(100)
    return agencies

@api_router.get("/services/agencies/{category}")
async def get_agencies_by_category(category: str):
    agencies = await db.agencies.find({"category": category}, {"_id": 0}).to_list(100)
    return agencies

# ============== GUIDES (Static Content) ==============

@api_router.get("/guides/pps")
async def get_pps_guide():
    return {
        "title": "Guia PPS Number",
        "title_en": "PPS Number Guide",
        "description": "O PPS (Personal Public Service) Number é essencial para trabalhar na Irlanda",
        "steps": [
            {
                "step": 1,
                "title": "Agende online",
                "title_en": "Book online",
                "description": "Acesse mywelfare.ie e agende seu atendimento",
                "link": "https://www.mywelfare.ie"
            },
            {
                "step": 2,
                "title": "Prepare os documentos",
                "title_en": "Prepare documents",
                "description": "Passaporte, comprovante de endereço, carta da escola",
                "documents": ["Passaporte válido", "Comprovante de endereço (utility bill)", "Carta da escola", "Formulário REG1"]
            },
            {
                "step": 3,
                "title": "Compareça ao atendimento",
                "title_en": "Attend appointment",
                "description": "Vá ao escritório do DSP no dia e hora marcados"
            },
            {
                "step": 4,
                "title": "Receba seu PPS",
                "title_en": "Receive your PPS",
                "description": "O número será enviado por correio em até 5 dias úteis"
            }
        ],
        "tips": [
            "Chegue 15 minutos antes do horário marcado",
            "Leve documentos originais e cópias",
            "O PPS é gratuito"
        ],
        "useful_links": [
            {"name": "MyWelfare.ie", "url": "https://www.mywelfare.ie"},
            {"name": "Citizens Information", "url": "https://www.citizensinformation.ie/en/social-welfare/irish-social-welfare-system/personal-public-service-number/"}
        ]
    }

@api_router.get("/guides/gnib")
async def get_gnib_guide():
    return {
        "title": "Guia GNIB/IRP",
        "title_en": "GNIB/IRP Guide",
        "description": "O IRP (Irish Residence Permit) é obrigatório para estudantes não-europeus",
        "steps": [
            {
                "step": 1,
                "title": "Agende online",
                "title_en": "Book online",
                "description": "Acesse o site do INIS para agendar",
                "link": "https://burghquayregistrationoffice.inis.gov.ie/"
            },
            {
                "step": 2,
                "title": "Prepare os documentos",
                "title_en": "Prepare documents",
                "description": "Documentos necessários para o registro",
                "documents": [
                    "Passaporte válido",
                    "Carta da escola",
                    "Comprovante de endereço",
                    "Comprovante financeiro (€4.200)",
                    "Seguro de saúde privado",
                    "Taxa de €300"
                ]
            },
            {
                "step": 3,
                "title": "Compareça ao Burgh Quay",
                "title_en": "Attend Burgh Quay",
                "description": "Vá ao Immigration Office com todos os documentos"
            },
            {
                "step": 4,
                "title": "Receba seu IRP Card",
                "title_en": "Receive IRP Card",
                "description": "O cartão será entregue no local ou enviado por correio"
            }
        ],
        "costs": {
            "registration_fee": 300,
            "currency": "EUR",
            "bank_statement_minimum": 4200
        },
        "tips": [
            "Agende com antecedência - as vagas acabam rápido!",
            "A taxa só pode ser paga com cartão de débito/crédito",
            "O IRP tem validade de 1 ano para estudantes"
        ],
        "useful_links": [
            {"name": "INIS Booking", "url": "https://burghquayregistrationoffice.inis.gov.ie/"},
            {"name": "Immigration Service", "url": "https://www.irishimmigration.ie/"}
        ]
    }

@api_router.get("/guides/passport")
async def get_passport_guide():
    return {
        "title": "Guia de Passaporte Brasileiro",
        "title_en": "Brazilian Passport Guide",
        "description": "Como tirar ou renovar seu passaporte brasileiro",
        "steps": [
            {
                "step": 1,
                "title": "Acesse o Portal da PF",
                "title_en": "Access Federal Police Portal",
                "description": "Entre no site da Polícia Federal e preencha o formulário",
                "link": "https://www.gov.br/pf/pt-br/assuntos/passaporte"
            },
            {
                "step": 2,
                "title": "Pague a taxa (GRU)",
                "title_en": "Pay the fee (GRU)",
                "description": "Emita e pague a Guia de Recolhimento da União",
                "cost": 257.25,
                "currency": "BRL"
            },
            {
                "step": 3,
                "title": "Agende o atendimento",
                "title_en": "Schedule appointment",
                "description": "Escolha um posto da PF e agende seu horário"
            },
            {
                "step": 4,
                "title": "Compareça ao atendimento",
                "title_en": "Attend appointment",
                "description": "Vá ao posto com os documentos originais",
                "documents": [
                    "RG ou CNH",
                    "CPF",
                    "Título de Eleitor (se aplicável)",
                    "Certificado de Reservista (homens)",
                    "Comprovante de pagamento da GRU"
                ]
            },
            {
                "step": 5,
                "title": "Retire seu passaporte",
                "title_en": "Pick up passport",
                "description": "Aguarde a emissão e retire no mesmo posto (6 a 10 dias úteis)"
            }
        ],
        "costs": {
            "regular": 257.25,
            "emergency": 334.42,
            "currency": "BRL"
        },
        "validity": {
            "adults": "10 anos",
            "minors": "5 anos (menores de 18 anos)"
        },
        "tips": [
            "Verifique se seu RG está atualizado (menos de 10 anos)",
            "Certidão de nascimento pode ser necessária",
            "Menores precisam de autorização dos pais"
        ],
        "useful_links": [
            {"name": "Portal da PF", "url": "https://www.gov.br/pf/pt-br/assuntos/passaporte"},
            {"name": "Emitir GRU", "url": "https://servicos.dpf.gov.br/gru/gru.html"}
        ]
    }

# ============== SEED DATA ==============

@api_router.post("/seed")
async def seed_database():
    """Seed database with initial data"""
    
    # Clear existing data
    await db.schools.delete_many({})
    await db.courses.delete_many({})
    await db.bus_routes.delete_many({})
    await db.agencies.delete_many({})
    
    # Seed Schools
    schools = [
        School(
            id="school-1",
            name="Dublin Language Institute",
            description="Uma das escolas de inglês mais conceituadas de Dublin, com mais de 20 anos de experiência em ensino de idiomas para estudantes internacionais.",
            description_en="One of Dublin's most renowned English schools, with over 20 years of experience teaching languages to international students.",
            address="35 Dame Street, Dublin 2",
            image_url="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
            rating=4.8,
            reviews_count=342,
            accreditation=["ACELS", "QQI", "MEI"],
            facilities=["Wi-Fi", "Biblioteca", "Sala de estudos", "Cafeteria", "Computadores"]
        ),
        School(
            id="school-2",
            name="Emerald Cultural Institute",
            description="Escola de prestígio localizada em casarões georgianos históricos, oferecendo programas intensivos de inglês e preparação para exames.",
            description_en="Prestigious school located in historic Georgian mansions, offering intensive English programs and exam preparation.",
            address="10 Palmerston Park, Dublin 6",
            image_url="https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
            rating=4.9,
            reviews_count=428,
            accreditation=["ACELS", "QQI", "IALC", "EAQUALS"],
            facilities=["Jardim", "Wi-Fi", "Biblioteca", "Sala multimídia", "Lounge"]
        ),
        School(
            id="school-3",
            name="Atlas Language School",
            description="Escola moderna no coração de Dublin, conhecida por seu método comunicativo e ambiente internacional diversificado.",
            description_en="Modern school in the heart of Dublin, known for its communicative method and diverse international environment.",
            address="Portobello House, Dublin 8",
            image_url="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
            rating=4.7,
            reviews_count=256,
            accreditation=["ACELS", "QQI", "Marketing English in Ireland"],
            facilities=["Wi-Fi", "Terraço", "Sala de jogos", "Cozinha compartilhada"]
        ),
        School(
            id="school-4",
            name="ISI Dublin",
            description="International Study Institute oferece cursos de inglês geral e profissional em localização privilegiada no centro da cidade.",
            description_en="International Study Institute offers general and professional English courses in a prime city center location.",
            address="4 Meetinghouse Lane, Dublin 7",
            image_url="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
            rating=4.6,
            reviews_count=189,
            accreditation=["ACELS", "QQI"],
            facilities=["Wi-Fi", "Computadores", "Área social", "Aulas online"]
        )
    ]
    
    for school in schools:
        await db.schools.insert_one(school.model_dump())
    
    # Seed Courses
    courses = [
        # Dublin Language Institute Courses
        Course(
            id="course-1",
            school_id="school-1",
            name="Inglês Geral - 25 semanas",
            name_en="General English - 25 weeks",
            description="Curso completo de inglês para todos os níveis, com foco em conversação, gramática e vocabulário.",
            description_en="Complete English course for all levels, focusing on conversation, grammar and vocabulary.",
            duration_weeks=25,
            hours_per_week=15,
            level="all_levels",
            price=2950.00,
            requirements=["Passaporte válido", "Seguro saúde"],
            includes=["Material didático", "Certificado", "Acesso à biblioteca"],
            start_dates=["2025-01-13", "2025-02-10", "2025-03-10", "2025-04-07"],
            available_spots=15
        ),
        Course(
            id="course-2",
            school_id="school-1",
            name="Preparatório IELTS - 12 semanas",
            name_en="IELTS Preparation - 12 weeks",
            description="Curso focado na preparação para o exame IELTS com simulados e técnicas de prova.",
            description_en="Course focused on IELTS exam preparation with mock tests and exam techniques.",
            duration_weeks=12,
            hours_per_week=20,
            level="intermediate",
            price=1980.00,
            requirements=["Nível intermediário de inglês", "Passaporte válido"],
            includes=["Material IELTS", "Simulados", "Certificado"],
            start_dates=["2025-01-20", "2025-03-17", "2025-05-12"],
            available_spots=12
        ),
        # Emerald Cultural Institute Courses
        Course(
            id="course-3",
            school_id="school-2",
            name="Inglês Intensivo - 25 semanas",
            name_en="Intensive English - 25 weeks",
            description="Programa intensivo com aulas pela manhã e workshops à tarde. Ideal para quem quer progredir rapidamente.",
            description_en="Intensive program with morning classes and afternoon workshops. Ideal for rapid progress.",
            duration_weeks=25,
            hours_per_week=26,
            level="all_levels",
            price=4200.00,
            requirements=["Passaporte válido", "Seguro saúde", "Visto de estudante"],
            includes=["Material didático premium", "Atividades sociais", "Certificado ACELS"],
            start_dates=["2025-01-06", "2025-02-03", "2025-03-03"],
            available_spots=10
        ),
        Course(
            id="course-4",
            school_id="school-2",
            name="Business English - 8 semanas",
            name_en="Business English - 8 weeks",
            description="Inglês para negócios com foco em apresentações, negociações e comunicação corporativa.",
            description_en="Business English focusing on presentations, negotiations and corporate communication.",
            duration_weeks=8,
            hours_per_week=20,
            level="advanced",
            price=1650.00,
            requirements=["Nível avançado de inglês"],
            includes=["Material especializado", "Networking events", "Certificado"],
            start_dates=["2025-02-17", "2025-04-14", "2025-06-09"],
            available_spots=8
        ),
        # Atlas Language School Courses
        Course(
            id="course-5",
            school_id="school-3",
            name="Inglês + Trabalho - 25 semanas",
            name_en="English + Work - 25 weeks",
            description="Combine aulas de inglês com a possibilidade de trabalhar meio período na Irlanda.",
            description_en="Combine English classes with the possibility of part-time work in Ireland.",
            duration_weeks=25,
            hours_per_week=15,
            level="all_levels",
            price=2750.00,
            requirements=["Passaporte válido", "Seguro saúde", "Comprovante financeiro"],
            includes=["Orientação para trabalho", "CV workshop", "Material didático"],
            start_dates=["2025-01-13", "2025-02-10", "2025-03-10"],
            available_spots=20
        ),
        # ISI Dublin Courses
        Course(
            id="course-6",
            school_id="school-4",
            name="Inglês Geral Manhã - 25 semanas",
            name_en="General English Morning - 25 weeks",
            description="Aulas no período da manhã, perfeito para quem quer trabalhar à tarde.",
            description_en="Morning classes, perfect for those who want to work in the afternoon.",
            duration_weeks=25,
            hours_per_week=15,
            level="all_levels",
            price=2500.00,
            requirements=["Passaporte válido"],
            includes=["Material didático", "Wi-Fi", "Certificado"],
            start_dates=["2025-01-20", "2025-02-17", "2025-03-17"],
            available_spots=18
        )
    ]
    
    for course in courses:
        await db.courses.insert_one(course.model_dump())
    
    # Seed Bus Routes
    bus_routes = [
        BusRoute(
            id="route-1",
            route_number="16",
            name="Dublin Airport - Centro",
            name_en="Dublin Airport - City Centre",
            from_location="Dublin Airport",
            to_location="O'Connell Street",
            frequency_minutes=15,
            first_bus="05:00",
            last_bus="00:30",
            fare=3.80,
            zones=["Airport", "City Centre"],
            popular_stops=["Airport Terminal 1", "Drumcondra", "Parnell Square", "O'Connell Street"]
        ),
        BusRoute(
            id="route-2",
            route_number="46A",
            name="Phoenix Park - Dun Laoghaire",
            name_en="Phoenix Park - Dun Laoghaire",
            from_location="Phoenix Park",
            to_location="Dun Laoghaire",
            frequency_minutes=10,
            first_bus="06:00",
            last_bus="23:30",
            fare=2.60,
            zones=["West Dublin", "South Dublin"],
            popular_stops=["Phoenix Park", "Heuston Station", "Dame Street", "Donnybrook", "Dun Laoghaire"]
        ),
        BusRoute(
            id="route-3",
            route_number="LUAS Green",
            name="Broombridge - Bride's Glen",
            name_en="Broombridge - Bride's Glen",
            from_location="Broombridge",
            to_location="Bride's Glen",
            frequency_minutes=5,
            first_bus="05:30",
            last_bus="00:30",
            fare=2.50,
            zones=["North Dublin", "City Centre", "South Dublin"],
            popular_stops=["Parnell", "O'Connell GPO", "Stephen's Green", "Ranelagh", "Dundrum"]
        ),
        BusRoute(
            id="route-4",
            route_number="DART",
            name="Howth - Greystones",
            name_en="Howth - Greystones",
            from_location="Howth",
            to_location="Greystones",
            frequency_minutes=10,
            first_bus="06:00",
            last_bus="23:45",
            fare=3.50,
            zones=["North Coast", "City", "South Coast"],
            popular_stops=["Howth", "Connolly", "Pearse", "Dun Laoghaire", "Bray", "Greystones"]
        ),
        BusRoute(
            id="route-5",
            route_number="747",
            name="Airport Express - Heuston",
            name_en="Airport Express - Heuston",
            from_location="Dublin Airport",
            to_location="Heuston Station",
            frequency_minutes=20,
            first_bus="05:45",
            last_bus="00:00",
            fare=8.00,
            zones=["Airport", "City Centre"],
            popular_stops=["Airport", "O'Connell Street", "Aston Quay", "Heuston Station"]
        )
    ]
    
    for route in bus_routes:
        await db.bus_routes.insert_one(route.model_dump())
    
    # Seed Government Agencies
    agencies = [
        GovernmentAgency(
            id="agency-1",
            name="INIS - Serviço de Imigração",
            name_en="INIS - Immigration Service",
            description="Responsável por vistos, permissões de residência e registro de imigrantes",
            description_en="Responsible for visas, residence permits and immigrant registration",
            category="immigration",
            address="Burgh Quay, Dublin 2",
            phone="+353 1 616 7700",
            email="immigrationsupport@justice.ie",
            website="https://www.irishimmigration.ie",
            opening_hours="Mon-Fri: 08:00 - 16:00",
            services=["IRP/GNIB Registration", "Visa Applications", "Stamp Changes"]
        ),
        GovernmentAgency(
            id="agency-2",
            name="DSP - Departamento de Proteção Social",
            name_en="DSP - Department of Social Protection",
            description="Emissão do PPS Number e serviços de proteção social",
            description_en="PPS Number issuance and social protection services",
            category="public_services",
            address="Various locations in Dublin",
            phone="+353 1 704 3000",
            email="info@welfare.ie",
            website="https://www.gov.ie/dsp",
            opening_hours="Mon-Fri: 09:00 - 17:00",
            services=["PPS Number", "Social Welfare", "JobPath"]
        ),
        GovernmentAgency(
            id="agency-3",
            name="Revenue - Receita Federal Irlandesa",
            name_en="Revenue - Irish Tax Authority",
            description="Questões fiscais, registro de emprego e impostos",
            description_en="Tax matters, employment registration and taxes",
            category="public_services",
            address="Castle House, South Great George's Street, Dublin 2",
            phone="+353 1 738 3660",
            email="taxpayerinfo@revenue.ie",
            website="https://www.revenue.ie",
            opening_hours="Mon-Fri: 09:30 - 16:30",
            services=["Tax Registration", "Tax Returns", "Emergency Tax Refunds"]
        ),
        GovernmentAgency(
            id="agency-4",
            name="HSE - Serviço de Saúde",
            name_en="HSE - Health Service Executive",
            description="Serviços de saúde pública, registro médico e medical cards",
            description_en="Public health services, medical registration and medical cards",
            category="public_services",
            address="Various Health Centres",
            phone="+353 1 240 8000",
            email="info@hse.ie",
            website="https://www.hse.ie",
            opening_hours="Mon-Fri: 09:00 - 17:00",
            services=["Medical Card", "GP Services", "Emergency Services"]
        ),
        GovernmentAgency(
            id="agency-5",
            name="Citizens Information",
            name_en="Citizens Information",
            description="Informações gratuitas sobre direitos e serviços na Irlanda",
            description_en="Free information about rights and services in Ireland",
            category="public_services",
            address="Various locations",
            phone="0818 07 4000",
            email="via website",
            website="https://www.citizensinformation.ie",
            opening_hours="Mon-Fri: 09:00 - 17:00",
            services=["Rights Information", "Social Services Info", "Employment Rights"]
        )
    ]
    
    for agency in agencies:
        await db.agencies.insert_one(agency.model_dump())
    
    return {
        "message": "Database seeded successfully",
        "schools": len(schools),
        "courses": len(courses),
        "bus_routes": len(bus_routes),
        "agencies": len(agencies)
    }

# ============== ROOT ==============

@api_router.get("/")
async def root():
    return {"message": "Dublin Study API", "version": "1.0.0"}

# Include router and add middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
