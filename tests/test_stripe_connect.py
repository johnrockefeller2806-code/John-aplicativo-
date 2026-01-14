"""
Test suite for Stripe Connect subscription plans for schools
Tests: GET /api/school/subscription/plans, GET /api/school/subscription, 
       GET /api/school/earnings, POST /api/school/subscription/subscribe
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSubscriptionPlansPublic:
    """Test public subscription plans endpoint (no auth required)"""
    
    def test_get_subscription_plans_returns_200(self):
        """GET /api/school/subscription/plans should return 200"""
        response = requests.get(f"{BASE_URL}/api/school/subscription/plans")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
    def test_get_subscription_plans_returns_3_plans(self):
        """Should return exactly 3 plans"""
        response = requests.get(f"{BASE_URL}/api/school/subscription/plans")
        data = response.json()
        assert "plans" in data, "Response should have 'plans' key"
        assert len(data["plans"]) == 3, f"Expected 3 plans, got {len(data['plans'])}"
        
    def test_starter_plan_details(self):
        """Starter plan should have correct details"""
        response = requests.get(f"{BASE_URL}/api/school/subscription/plans")
        data = response.json()
        starter = next((p for p in data["plans"] if p["id"] == "starter"), None)
        
        assert starter is not None, "Starter plan not found"
        assert starter["name"] == "Starter", f"Expected name 'Starter', got {starter['name']}"
        assert starter["price"] == 49.0, f"Expected price 49.0, got {starter['price']}"
        assert starter["commission_rate"] == 8.0, f"Expected commission 8%, got {starter['commission_rate']}%"
        
    def test_professional_plan_details(self):
        """Professional plan should have correct details"""
        response = requests.get(f"{BASE_URL}/api/school/subscription/plans")
        data = response.json()
        professional = next((p for p in data["plans"] if p["id"] == "professional"), None)
        
        assert professional is not None, "Professional plan not found"
        assert professional["name"] == "Professional", f"Expected name 'Professional', got {professional['name']}"
        assert professional["price"] == 99.0, f"Expected price 99.0, got {professional['price']}"
        assert professional["commission_rate"] == 5.0, f"Expected commission 5%, got {professional['commission_rate']}%"
        
    def test_premium_plan_details(self):
        """Premium plan should have correct details"""
        response = requests.get(f"{BASE_URL}/api/school/subscription/plans")
        data = response.json()
        premium = next((p for p in data["plans"] if p["id"] == "premium"), None)
        
        assert premium is not None, "Premium plan not found"
        assert premium["name"] == "Premium", f"Expected name 'Premium', got {premium['name']}"
        assert premium["price"] == 199.0, f"Expected price 199.0, got {premium['price']}"
        assert premium["commission_rate"] == 3.0, f"Expected commission 3%, got {premium['commission_rate']}%"
        
    def test_plans_have_required_fields(self):
        """Each plan should have id, name, price, commission_rate, description"""
        response = requests.get(f"{BASE_URL}/api/school/subscription/plans")
        data = response.json()
        
        required_fields = ["id", "name", "price", "commission_rate", "description"]
        for plan in data["plans"]:
            for field in required_fields:
                assert field in plan, f"Plan {plan.get('id', 'unknown')} missing field '{field}'"


class TestSchoolAuth:
    """Test school authentication and registration"""
    
    @pytest.fixture
    def school_credentials(self):
        """Create test school credentials"""
        import uuid
        unique_id = str(uuid.uuid4())[:8]
        return {
            "name": f"Test School Owner {unique_id}",
            "email": f"test_school_{unique_id}@test.com",
            "password": "testpass123",
            "school_name": f"Test School {unique_id}",
            "description": "Escola de teste para verificar funcionalidades",
            "description_en": "Test school to verify functionalities",
            "address": "123 Test Street, Dublin",
            "phone": "+353 1 234 5678"
        }
    
    def test_register_school_returns_token(self, school_credentials):
        """POST /api/auth/register-school should return token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/register-school",
            json=school_credentials
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "access_token" in data, "Response should have access_token"
        assert "user" in data, "Response should have user"
        assert data["user"]["role"] == "school", f"Expected role 'school', got {data['user']['role']}"
        assert "school_id" in data["user"], "User should have school_id"
        
    def test_school_login(self, school_credentials):
        """Test school login after registration"""
        # First register
        reg_response = requests.post(
            f"{BASE_URL}/api/auth/register-school",
            json=school_credentials
        )
        assert reg_response.status_code == 200
        
        # Then login
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": school_credentials["email"],
                "password": school_credentials["password"]
            }
        )
        assert login_response.status_code == 200
        data = login_response.json()
        assert data["user"]["role"] == "school"


class TestSchoolSubscriptionEndpoints:
    """Test school subscription endpoints (requires school auth)"""
    
    @pytest.fixture
    def school_token(self):
        """Register a new school and return token"""
        import uuid
        unique_id = str(uuid.uuid4())[:8]
        response = requests.post(
            f"{BASE_URL}/api/auth/register-school",
            json={
                "name": f"Test School Owner {unique_id}",
                "email": f"test_school_{unique_id}@test.com",
                "password": "testpass123",
                "school_name": f"Test School {unique_id}",
                "description": "Escola de teste",
                "description_en": "Test school",
                "address": "123 Test Street, Dublin",
                "phone": "+353 1 234 5678"
            }
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip(f"Could not register school: {response.text}")
        
    def test_get_subscription_requires_auth(self):
        """GET /api/school/subscription should require authentication"""
        response = requests.get(f"{BASE_URL}/api/school/subscription")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
    def test_get_subscription_with_auth(self, school_token):
        """GET /api/school/subscription should return subscription status"""
        response = requests.get(
            f"{BASE_URL}/api/school/subscription",
            headers={"Authorization": f"Bearer {school_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # New school should have no plan
        assert "plan" in data, "Response should have 'plan' field"
        assert "status" in data, "Response should have 'status' field"
        assert data["plan"] == "none", f"New school should have plan 'none', got {data['plan']}"
        assert data["status"] == "inactive", f"New school should have status 'inactive', got {data['status']}"
        
    def test_get_earnings_requires_auth(self):
        """GET /api/school/earnings should require authentication"""
        response = requests.get(f"{BASE_URL}/api/school/earnings")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
    def test_get_earnings_with_auth(self, school_token):
        """GET /api/school/earnings should return earnings breakdown"""
        response = requests.get(
            f"{BASE_URL}/api/school/earnings",
            headers={"Authorization": f"Bearer {school_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Check response structure
        assert "summary" in data, "Response should have 'summary' field"
        assert "plan" in data, "Response should have 'plan' field"
        assert "monthly" in data, "Response should have 'monthly' field"
        
        # Check summary fields
        summary = data["summary"]
        assert "total_gross" in summary, "Summary should have 'total_gross'"
        assert "total_commission" in summary, "Summary should have 'total_commission'"
        assert "commission_rate" in summary, "Summary should have 'commission_rate'"
        assert "total_net" in summary, "Summary should have 'total_net'"
        assert "total_enrollments" in summary, "Summary should have 'total_enrollments'"
        
    def test_subscribe_requires_auth(self):
        """POST /api/school/subscription/subscribe should require authentication"""
        response = requests.post(
            f"{BASE_URL}/api/school/subscription/subscribe",
            json={"plan": "starter", "origin_url": "https://test.com"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
    def test_subscribe_invalid_plan(self, school_token):
        """POST /api/school/subscription/subscribe should reject invalid plan"""
        response = requests.post(
            f"{BASE_URL}/api/school/subscription/subscribe",
            headers={"Authorization": f"Bearer {school_token}"},
            json={"plan": "invalid_plan", "origin_url": "https://test.com"}
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        
    def test_subscribe_starter_creates_checkout(self, school_token):
        """POST /api/school/subscription/subscribe should create Stripe checkout session"""
        response = requests.post(
            f"{BASE_URL}/api/school/subscription/subscribe",
            headers={"Authorization": f"Bearer {school_token}"},
            json={"plan": "starter", "origin_url": "https://dublin-exchange.preview.emergentagent.com"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "checkout_url" in data, "Response should have 'checkout_url'"
        assert "session_id" in data, "Response should have 'session_id'"
        assert data["checkout_url"].startswith("https://"), "checkout_url should be HTTPS URL"
        
    def test_subscribe_professional_creates_checkout(self, school_token):
        """POST /api/school/subscription/subscribe should work for professional plan"""
        response = requests.post(
            f"{BASE_URL}/api/school/subscription/subscribe",
            headers={"Authorization": f"Bearer {school_token}"},
            json={"plan": "professional", "origin_url": "https://dublin-exchange.preview.emergentagent.com"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "checkout_url" in data
        assert "session_id" in data
        
    def test_subscribe_premium_creates_checkout(self, school_token):
        """POST /api/school/subscription/subscribe should work for premium plan"""
        response = requests.post(
            f"{BASE_URL}/api/school/subscription/subscribe",
            headers={"Authorization": f"Bearer {school_token}"},
            json={"plan": "premium", "origin_url": "https://dublin-exchange.preview.emergentagent.com"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "checkout_url" in data
        assert "session_id" in data


class TestStudentCannotAccessSchoolEndpoints:
    """Test that student users cannot access school endpoints"""
    
    @pytest.fixture
    def student_token(self):
        """Register a student and return token"""
        import uuid
        unique_id = str(uuid.uuid4())[:8]
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "name": f"Test Student {unique_id}",
                "email": f"test_student_{unique_id}@test.com",
                "password": "testpass123"
            }
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip(f"Could not register student: {response.text}")
        
    def test_student_cannot_access_subscription(self, student_token):
        """Students should not access /api/school/subscription"""
        response = requests.get(
            f"{BASE_URL}/api/school/subscription",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        
    def test_student_cannot_access_earnings(self, student_token):
        """Students should not access /api/school/earnings"""
        response = requests.get(
            f"{BASE_URL}/api/school/earnings",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        
    def test_student_cannot_subscribe(self, student_token):
        """Students should not be able to subscribe to plans"""
        response = requests.post(
            f"{BASE_URL}/api/school/subscription/subscribe",
            headers={"Authorization": f"Bearer {student_token}"},
            json={"plan": "starter", "origin_url": "https://test.com"}
        )
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"


class TestAdminLogin:
    """Test admin login for verification"""
    
    def test_admin_login(self):
        """Admin should be able to login"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "admin@dublinstudy.com",
                "password": "admin123"
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["user"]["role"] == "admin", f"Expected role 'admin', got {data['user']['role']}"
