"""
Test Google OAuth Authentication Features
Tests for:
- /api/auth/me returns 401 when not authenticated
- /api/auth/google/session exists and handles session processing
- /api/auth/logout exists and invalidates session
- Session-based authentication flow
"""
import pytest
import requests
import os
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

# MongoDB connection
mongo_client = MongoClient(MONGO_URL)
db = mongo_client[DB_NAME]


class TestAuthEndpoints:
    """Test auth endpoints for Google OAuth"""

    def test_auth_me_returns_401_when_unauthenticated(self):
        """GET /api/auth/me should return 401 when not authenticated"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        print("✅ /api/auth/me returns 401 when unauthenticated")

    def test_google_session_endpoint_exists(self):
        """POST /api/auth/google/session should exist and reject invalid session"""
        response = requests.post(
            f"{BASE_URL}/api/auth/google/session",
            json={"session_id": "invalid_test_session"},
            headers={"Content-Type": "application/json"}
        )
        # Should return 401 for invalid session (not 404/405)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        data = response.json()
        assert "detail" in data
        print("✅ /api/auth/google/session endpoint exists and rejects invalid session")

    def test_logout_endpoint_exists(self):
        """POST /api/auth/logout should exist"""
        response = requests.post(f"{BASE_URL}/api/auth/logout")
        # Should return 200 even without token (just clears cookie)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get("message") == "Logged out successfully"
        print("✅ /api/auth/logout endpoint exists")


class TestSessionAuthentication:
    """Test session-based authentication flow"""
    
    @pytest.fixture(autouse=True)
    def setup_and_cleanup(self):
        """Setup test user and session, cleanup after"""
        # Generate unique IDs
        timestamp = int(datetime.now(timezone.utc).timestamp() * 1000)
        self.user_id = f"test_oauth_user_{timestamp}"
        self.session_token = f"test_oauth_session_{timestamp}"
        self.user_email = f"test.oauth.{timestamp}@example.com"
        
        # Create test user
        db.users.insert_one({
            "user_id": self.user_id,
            "id": self.user_id,
            "email": self.user_email,
            "name": "Test OAuth User",
            "role": "student",
            "plan": "free",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        # Create session
        db.user_sessions.insert_one({
            "user_id": self.user_id,
            "session_token": self.session_token,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc)
        })
        
        yield
        
        # Cleanup
        db.users.delete_many({"user_id": self.user_id})
        db.user_sessions.delete_many({"session_token": self.session_token})

    def test_auth_me_with_valid_session(self):
        """GET /api/auth/me with valid session token should return user data"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {self.session_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("id") == self.user_id
        assert data.get("email") == self.user_email
        assert data.get("role") == "student"
        print("✅ /api/auth/me returns user data with valid session token")

    def test_auth_me_with_cookie_session(self):
        """GET /api/auth/me with session in cookie should work"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            cookies={"session_token": self.session_token}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("id") == self.user_id
        print("✅ /api/auth/me accepts session token from cookie")

    def test_logout_invalidates_session(self):
        """POST /api/auth/logout should invalidate session token"""
        # First verify session works
        me_response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {self.session_token}"}
        )
        assert me_response.status_code == 200, "Session should be valid before logout"
        
        # Logout
        logout_response = requests.post(
            f"{BASE_URL}/api/auth/logout",
            headers={"Authorization": f"Bearer {self.session_token}"}
        )
        assert logout_response.status_code == 200
        assert logout_response.json().get("message") == "Logged out successfully"
        
        # Verify session is invalidated
        me_after_logout = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {self.session_token}"}
        )
        assert me_after_logout.status_code == 401, "Session should be invalid after logout"
        print("✅ Logout successfully invalidates session")


class TestGoogleSessionProcessing:
    """Test Google OAuth session processing"""

    def test_google_session_missing_session_id(self):
        """POST /api/auth/google/session without session_id should fail"""
        response = requests.post(
            f"{BASE_URL}/api/auth/google/session",
            json={},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422, f"Expected 422 for missing field, got {response.status_code}"
        print("✅ /api/auth/google/session requires session_id field")

    def test_google_session_empty_session_id(self):
        """POST /api/auth/google/session with empty session_id should fail"""
        response = requests.post(
            f"{BASE_URL}/api/auth/google/session",
            json={"session_id": ""},
            headers={"Content-Type": "application/json"}
        )
        # Empty session will fail validation with Emergent Auth
        assert response.status_code == 401, f"Expected 401 for empty session_id, got {response.status_code}"
        print("✅ /api/auth/google/session rejects empty session_id")


class TestNoTraditionalLogin:
    """Verify traditional email/password login is removed"""

    def test_no_login_endpoint(self):
        """Traditional /api/auth/login should not exist or return 404/405"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "test@test.com", "password": "password123"},
            headers={"Content-Type": "application/json"}
        )
        # Should be 404 (not found) or 405 (method not allowed)
        assert response.status_code in [404, 405, 422], f"Traditional login should not exist, got {response.status_code}"
        print("✅ Traditional /api/auth/login endpoint is not available")

    def test_no_register_endpoint(self):
        """Traditional /api/auth/register should not exist or return 404/405"""
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"email": "test@test.com", "password": "password123", "name": "Test"},
            headers={"Content-Type": "application/json"}
        )
        # Should be 404 (not found) or 405 (method not allowed)  
        assert response.status_code in [404, 405, 422], f"Traditional register should not exist, got {response.status_code}"
        print("✅ Traditional /api/auth/register endpoint is not available")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
