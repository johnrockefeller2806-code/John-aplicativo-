"""
Chat Module - WebSocket-based real-time chat for Dublin Study
Features:
- Real-time messaging via WebSockets
- General group chat for all users
- Online presence tracking
- Message history (auto-delete after 2 days)
- Moderator controls (delete messages, ban users)
- Emoji support
- AI Agent "Agente Comunidade" powered by OpenAI GPT
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Set
from datetime import datetime, timezone, timedelta
import uuid
import json
import logging
import jwt
import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import LLM for Agente Comunidade
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    LLM_AVAILABLE = True
except ImportError:
    LLM_AVAILABLE = False
    logging.warning("emergentintegrations not available - Agente Comunidade disabled")

logger = logging.getLogger(__name__)

# Will be set by main server.py
db = None
JWT_SECRET = None
JWT_ALGORITHM = "HS256"

# ============== AGENTE COMUNIDADE CONFIG ==============

AGENTE_COMUNIDADE_NAME = "Agente Comunidade"
AGENTE_COMUNIDADE_ID = "agente-comunidade-stuff"
AGENTE_COMUNIDADE_AVATAR = "🤖"

AGENTE_COMUNIDADE_SYSTEM_PROMPT = """Você é o Agente Comunidade da STUFF Intercâmbio, um assistente amigável e prestativo especializado em ajudar brasileiros que querem estudar inglês na Irlanda, especialmente em Dublin.

🎯 SUA PERSONALIDADE:
- Você é como um amigo brasileiro que já mora em Dublin e conhece tudo sobre a vida de intercambista
- Seja informal, use emojis, mas seja sempre profissional e preciso nas informações
- Responda em português brasileiro

📚 VOCÊ É ESPECIALISTA EM:
1. **PPS (Personal Public Service Number)**: Como tirar, documentos necessários, agendamento em mywelfare.ie
2. **GNIB/IRP (Immigration Registration)**: Processo de registro, documentos, custos (€300)
3. **Vistos de estudante**: Stamp 2, regras de trabalho (20h/semana durante aulas, 40h nas férias)
4. **Escolas de inglês em Dublin**: Tipos de cursos, acreditações (ACELS, MEI)
5. **Custo de vida**: Aluguel, transporte, alimentação em Dublin
6. **Transporte público**: Leap Card, Dublin Bus, Luas, DART
7. **Trabalho na Irlanda**: Como conseguir emprego, direitos trabalhistas
8. **Moradia**: Como encontrar quarto/apartamento, áreas de Dublin

⚠️ REGRAS IMPORTANTES:
- Se não souber algo com certeza, seja honesto e sugira buscar informações oficiais
- Nunca invente informações sobre processos legais ou imigração
- Mantenha respostas concisas (máximo 3-4 parágrafos)
- Use listas e emojis para organizar informações
- Sempre encoraje o usuário a verificar informações em sites oficiais quando aplicável

🔗 SITES ÚTEIS QUE VOCÊ PODE MENCIONAR:
- mywelfare.ie (PPS)
- burghquayregistrationoffice.inis.gov.ie (GNIB/IRP)
- citizensinformation.ie (informações gerais)
- revenue.ie (impostos)
- transportforireland.ie (transporte)

Responda sempre de forma amigável e acolhedora, lembrando que muitos usuários estão ansiosos ou com medo de fazer intercâmbio pela primeira vez! 🇮🇪🇧🇷"""

async def get_agente_comunidade_response(user_message: str, user_name: str) -> str:
    """Get response from Agente Comunidade AI"""
    if not LLM_AVAILABLE:
        return "Desculpe, o Agente Comunidade está temporariamente indisponível. Por favor, tente novamente mais tarde! 🙏"
    
    try:
        api_key = os.getenv("EMERGENT_LLM_KEY")
        if not api_key:
            logger.error("EMERGENT_LLM_KEY not found in environment")
            return "Desculpe, não consegui processar sua pergunta no momento. Tente novamente! 🙏"
        
        # Create a unique session for this conversation
        session_id = f"agente-comunidade-{uuid.uuid4()}"
        
        # Initialize the chat
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=AGENTE_COMUNIDADE_SYSTEM_PROMPT
        ).with_model("openai", "gpt-4.1")
        
        # Create the user message with context
        message = UserMessage(
            text=f"{user_name} perguntou: {user_message}"
        )
        
        # Get response
        response = await chat.send_message(message)
        
        return response
        
    except Exception as e:
        logger.error(f"Error getting Agente Comunidade response: {e}")
        return "Opa, tive um probleminha aqui! 😅 Pode repetir sua pergunta? Se o erro persistir, tente novamente em alguns minutos."

def should_trigger_agente(content: str) -> bool:
    """Check if message should trigger Agente Comunidade"""
    content_lower = content.lower()
    triggers = [
        "@agentecomunidade",
        "@agente",
        "@stuff",
        "@bot",
        "@ajuda"
    ]
    return any(trigger in content_lower for trigger in triggers)

def clean_message_for_ai(content: str) -> str:
    """Remove trigger mentions from message for AI processing"""
    import re
    # Remove @mentions
    cleaned = re.sub(r'@\w+\s*', '', content).strip()
    return cleaned if cleaned else content

chat_router = APIRouter(prefix="/api/chat", tags=["chat"])

# ============== MODELS ==============

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    content: str
    message_type: str = "text"  # text, audio, system, deleted
    audio_data: Optional[str] = None  # Base64 audio data
    audio_duration: Optional[int] = None  # Duration in seconds
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    deleted: bool = False
    deleted_by: Optional[str] = None

class OnlineUser(BaseModel):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    role: str
    last_seen: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BannedUser(BaseModel):
    user_id: str
    user_email: str
    banned_by: str
    reason: str
    banned_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    expires_at: str  # Ban duration

class SendMessageRequest(BaseModel):
    content: str

class DeleteMessageRequest(BaseModel):
    message_id: str
    reason: Optional[str] = None

class BanUserRequest(BaseModel):
    user_id: str
    reason: str
    duration_hours: int = 24  # Default 24 hours ban

# ============== CONNECTION MANAGER ==============

class ConnectionManager:
    """Manages WebSocket connections for the chat"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}  # user_id -> websocket
        self.user_info: Dict[str, dict] = {}  # user_id -> user info
    
    async def connect(self, websocket: WebSocket, user_id: str, user_info: dict):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.user_info[user_id] = user_info
        logger.info(f"User {user_info.get('name', user_id)} connected to chat")
    
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.user_info:
            del self.user_info[user_id]
        logger.info(f"User {user_id} disconnected from chat")
    
    async def broadcast(self, message: dict):
        """Send message to all connected users"""
        disconnected = []
        for user_id, connection in self.active_connections.items():
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error sending to {user_id}: {e}")
                disconnected.append(user_id)
        
        # Clean up disconnected users
        for user_id in disconnected:
            self.disconnect(user_id)
    
    async def send_personal(self, user_id: str, message: dict):
        """Send message to specific user"""
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_json(message)
            except Exception as e:
                logger.error(f"Error sending personal message to {user_id}: {e}")
    
    def get_online_users(self) -> List[dict]:
        """Get list of online users"""
        return [
            {
                "user_id": user_id,
                "user_name": info.get("name", "Unknown"),
                "user_avatar": info.get("avatar"),
                "role": info.get("role", "student")
            }
            for user_id, info in self.user_info.items()
        ]
    
    def is_online(self, user_id: str) -> bool:
        return user_id in self.active_connections

manager = ConnectionManager()

# ============== HELPER FUNCTIONS ==============

def init_chat_module(database, jwt_secret):
    """Initialize the chat module with database and JWT secret"""
    global db, JWT_SECRET
    db = database
    JWT_SECRET = jwt_secret

async def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return user data"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
        return user
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        return None

async def is_user_banned(user_id: str) -> bool:
    """Check if user is currently banned"""
    ban = await db.chat_bans.find_one({
        "user_id": user_id,
        "expires_at": {"$gt": datetime.now(timezone.utc).isoformat()}
    })
    return ban is not None

async def get_ban_info(user_id: str) -> Optional[dict]:
    """Get ban information for a user"""
    ban = await db.chat_bans.find_one({
        "user_id": user_id,
        "expires_at": {"$gt": datetime.now(timezone.utc).isoformat()}
    }, {"_id": 0})
    return ban

async def setup_ttl_index():
    """Setup TTL index for auto-deleting messages after 2 days"""
    try:
        # Create TTL index on created_at field (48 hours = 172800 seconds)
        await db.chat_messages.create_index(
            "expire_at",
            expireAfterSeconds=0
        )
        logger.info("Chat TTL index created/verified")
    except Exception as e:
        logger.warning(f"TTL index setup: {e}")

# ============== REST ENDPOINTS ==============

@chat_router.get("/messages")
async def get_messages(
    limit: int = Query(50, ge=1, le=100),
    before: Optional[str] = None
):
    """Get recent chat messages"""
    query = {"deleted": False}
    if before:
        query["created_at"] = {"$lt": before}
    
    messages = await db.chat_messages.find(
        query, 
        {"_id": 0, "expire_at": 0}  # Exclude only _id and expire_at
    ).sort("created_at", -1).limit(limit).to_list(limit)
    
    # Return in chronological order
    return list(reversed(messages))

@chat_router.get("/online")
async def get_online_users_endpoint():
    """Get list of currently online users"""
    return manager.get_online_users()

@chat_router.get("/ban-status")
async def check_ban_status(user_id: str):
    """Check if a user is banned"""
    ban = await get_ban_info(user_id)
    if ban:
        return {
            "banned": True,
            "reason": ban.get("reason"),
            "expires_at": ban.get("expires_at")
        }
    return {"banned": False}

@chat_router.delete("/messages/{message_id}")
async def delete_message(message_id: str, token: str = Query(...)):
    """Delete a message - users can delete their own, admins can delete any"""
    user = await verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Find the message first
    message = await db.chat_messages.find_one({"id": message_id})
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Check permission: user can delete own messages, admin can delete any
    is_own_message = message.get("user_id") == user["id"]
    is_admin = user.get("role") == "admin"
    
    if not is_own_message and not is_admin:
        raise HTTPException(status_code=403, detail="Você só pode apagar suas próprias mensagens")
    
    # Mark message as deleted
    deleted_text = "[Mensagem apagada]" if is_own_message else "[Mensagem removida pelo moderador]"
    result = await db.chat_messages.update_one(
        {"id": message_id},
        {"$set": {
            "deleted": True,
            "deleted_by": user["id"],
            "content": deleted_text,
            "message_type": "deleted",
            "audio_data": None  # Remove audio data too
        }}
    )
    
    # Broadcast deletion to all connected users
    await manager.broadcast({
        "type": "message_deleted",
        "message_id": message_id,
        "deleted_by": user["name"]
    })
    
    logger.info(f"Message {message_id} deleted by {user['name']}")
    return {"message": "Message deleted"}

@chat_router.post("/ban")
async def ban_user(request: BanUserRequest, token: str = Query(...)):
    """Ban a user from chat (admin only)"""
    admin = await verify_token(token)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    if admin.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Get user to ban
    user_to_ban = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    if not user_to_ban:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Can't ban admins
    if user_to_ban.get("role") == "admin":
        raise HTTPException(status_code=400, detail="Cannot ban admin users")
    
    # Create ban record
    expires_at = (datetime.now(timezone.utc) + timedelta(hours=request.duration_hours)).isoformat()
    ban = BannedUser(
        user_id=request.user_id,
        user_email=user_to_ban["email"],
        banned_by=admin["id"],
        reason=request.reason,
        expires_at=expires_at
    )
    
    await db.chat_bans.insert_one(ban.model_dump())
    
    # Notify the banned user and disconnect them
    await manager.send_personal(request.user_id, {
        "type": "banned",
        "reason": request.reason,
        "expires_at": expires_at
    })
    
    # Broadcast system message
    await manager.broadcast({
        "type": "system",
        "content": f"{user_to_ban['name']} foi removido do chat por um moderador.",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    logger.info(f"User {request.user_id} banned by admin {admin['name']} for {request.duration_hours}h")
    return {"message": "User banned", "expires_at": expires_at}

@chat_router.delete("/ban/{user_id}")
async def unban_user(user_id: str, token: str = Query(...)):
    """Unban a user (admin only)"""
    admin = await verify_token(token)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    if admin.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.chat_bans.delete_many({"user_id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No ban found for user")
    
    logger.info(f"User {user_id} unbanned by admin {admin['name']}")
    return {"message": "User unbanned"}

@chat_router.get("/bans")
async def get_banned_users(token: str = Query(...)):
    """Get list of banned users (admin only)"""
    admin = await verify_token(token)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    if admin.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    bans = await db.chat_bans.find(
        {"expires_at": {"$gt": datetime.now(timezone.utc).isoformat()}},
        {"_id": 0}
    ).to_list(100)
    
    return bans

# ============== AGENTE COMUNIDADE HANDLER ==============

async def process_agente_comunidade_response(user_message: str, user_name: str):
    """Process and broadcast Agente Comunidade response"""
    try:
        # Show typing indicator
        await manager.broadcast({
            "type": "typing",
            "user_id": AGENTE_COMUNIDADE_ID,
            "user_name": AGENTE_COMUNIDADE_NAME
        })
        
        # Get AI response
        response = await get_agente_comunidade_response(user_message, user_name)
        
        # Create agent message
        agent_message = ChatMessage(
            user_id=AGENTE_COMUNIDADE_ID,
            user_name=AGENTE_COMUNIDADE_NAME,
            user_avatar=None,
            content=response,
            message_type="text"
        )
        
        # Save to database
        message_dict = agent_message.model_dump()
        message_dict["expire_at"] = datetime.now(timezone.utc) + timedelta(days=2)
        message_dict["is_agent"] = True
        await db.chat_messages.insert_one(message_dict)
        
        # Broadcast agent response
        await manager.broadcast({
            "type": "message",
            "message": {
                "id": agent_message.id,
                "user_id": agent_message.user_id,
                "user_name": agent_message.user_name,
                "user_avatar": agent_message.user_avatar,
                "content": agent_message.content,
                "message_type": agent_message.message_type,
                "created_at": agent_message.created_at,
                "is_agent": True
            }
        })
        
        logger.info(f"Agente Comunidade responded to: {user_message[:50]}...")
        
    except Exception as e:
        logger.error(f"Error in Agente Comunidade handler: {e}")

# ============== WEBSOCKET ENDPOINT ==============

@chat_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    """WebSocket endpoint for real-time chat"""
    
    # Verify token
    user = await verify_token(token)
    if not user:
        await websocket.close(code=4001, reason="Invalid token")
        return
    
    user_id = user["id"]
    
    # Check if user is banned
    if await is_user_banned(user_id):
        ban_info = await get_ban_info(user_id)
        await websocket.close(code=4002, reason=f"Banned until {ban_info.get('expires_at')}")
        return
    
    # Connect user
    user_info = {
        "id": user_id,
        "name": user.get("name", "Unknown"),
        "avatar": user.get("avatar"),
        "role": user.get("role", "student")
    }
    
    await manager.connect(websocket, user_id, user_info)
    
    try:
        # Send initial data to user
        await websocket.send_json({
            "type": "connected",
            "user": user_info,
            "online_users": manager.get_online_users()
        })
        
        # Broadcast user joined
        await manager.broadcast({
            "type": "user_joined",
            "user": {
                "user_id": user_id,
                "user_name": user_info["name"],
                "role": user_info["role"]
            },
            "online_count": len(manager.active_connections)
        })
        
        # Listen for messages
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "message":
                content = data.get("content", "").strip()
                message_type = data.get("message_type", "text")
                audio_data = data.get("audio_data")
                audio_duration = data.get("audio_duration")
                
                logger.info(f"Message from {user_info['name']}: type={message_type}, content_len={len(content)}, has_audio={bool(audio_data)}")
                
                # For audio messages, allow larger content (base64)
                max_length = 5000000 if message_type == "audio" else 1000
                
                if not content or len(content) > max_length:
                    logger.warning(f"Invalid message from {user_info['name']}: empty={not content}, len={len(content)}")
                    await websocket.send_json({
                        "type": "error",
                        "message": "Mensagem inválida (vazia ou muito longa)"
                    })
                    continue
                
                # Check if still not banned
                if await is_user_banned(user_id):
                    await websocket.send_json({
                        "type": "error",
                        "message": "Você foi banido do chat"
                    })
                    continue
                
                # Create message
                message = ChatMessage(
                    user_id=user_id,
                    user_name=user_info["name"],
                    user_avatar=user_info.get("avatar"),
                    content=content,
                    message_type=message_type,
                    audio_data=audio_data,
                    audio_duration=audio_duration
                )
                
                # Save to database with TTL (2 days = 48 hours)
                message_dict = message.model_dump()
                message_dict["expire_at"] = datetime.now(timezone.utc) + timedelta(days=2)
                await db.chat_messages.insert_one(message_dict)
                
                # Broadcast to all users
                await manager.broadcast({
                    "type": "message",
                    "message": {
                        "id": message.id,
                        "user_id": message.user_id,
                        "user_name": message.user_name,
                        "user_avatar": message.user_avatar,
                        "content": message.content,
                        "message_type": message.message_type,
                        "audio_data": message.audio_data,
                        "audio_duration": message.audio_duration,
                        "created_at": message.created_at,
                        "is_admin": user_info["role"] == "admin"
                    }
                })
                
                # Check if message should trigger Agente Comunidade
                if message_type == "text" and should_trigger_agente(content):
                    # Process in background to not block
                    asyncio.create_task(
                        process_agente_comunidade_response(
                            clean_message_for_ai(content),
                            user_info["name"]
                        )
                    )
            
            elif data.get("type") == "typing":
                # Broadcast typing indicator
                await manager.broadcast({
                    "type": "typing",
                    "user_id": user_id,
                    "user_name": user_info["name"]
                })
            
            elif data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
    
    except WebSocketDisconnect:
        logger.info(f"User {user_info['name']} disconnected")
    except Exception as e:
        logger.error(f"WebSocket error for user {user_id}: {e}")
    finally:
        manager.disconnect(user_id)
        
        # Broadcast user left
        await manager.broadcast({
            "type": "user_left",
            "user_id": user_id,
            "user_name": user_info["name"],
            "online_count": len(manager.active_connections)
        })
