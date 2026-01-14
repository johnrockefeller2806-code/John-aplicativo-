"""
Chat Module Tests - WebSocket-based real-time chat for Dublin Study
Tests:
- GET /api/chat/messages - Get recent chat messages
- GET /api/chat/online - Get online users
- GET /api/chat/ban-status - Check if user is banned
- DELETE /api/chat/messages/{id} - Delete message (admin only)
- POST /api/chat/ban - Ban user (admin only)
- DELETE /api/chat/ban/{user_id} - Unban user (admin only)
- GET /api/chat/bans - Get banned users list (admin only)
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dublin-exchange.preview.emergentagent.com')

# Test credentials
ADMIN_EMAIL = "admin@dublinstudy.com"
ADMIN_PASSWORD = "admin123"

# Test user for ban testing
TEST_USER_EMAIL = f"test_chat_user_{uuid.uuid4().hex[:8]}@test.com"
TEST_USER_PASSWORD = "testpass123"
TEST_USER_NAME = "Test Chat User"


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def admin_token(api_client):
    """Get admin authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    return response.json()["access_token"]


@pytest.fixture(scope="module")
def test_user_data(api_client):
    """Create a test user for ban testing"""
    response = api_client.post(f"{BASE_URL}/api/auth/register", json={
        "name": TEST_USER_NAME,
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD
    })
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 400:
        # User already exists, try to login
        login_response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        if login_response.status_code == 200:
            return login_response.json()
    pytest.skip("Could not create or login test user")


class TestChatMessages:
    """Tests for chat messages endpoints"""
    
    def test_get_messages_returns_list(self, api_client):
        """GET /api/chat/messages should return a list of messages"""
        response = api_client.get(f"{BASE_URL}/api/chat/messages")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/chat/messages returned {len(data)} messages")
    
    def test_get_messages_with_limit(self, api_client):
        """GET /api/chat/messages with limit parameter"""
        response = api_client.get(f"{BASE_URL}/api/chat/messages?limit=10")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 10
        print(f"✓ GET /api/chat/messages?limit=10 returned {len(data)} messages")
    
    def test_messages_have_required_fields(self, api_client):
        """Messages should have required fields"""
        response = api_client.get(f"{BASE_URL}/api/chat/messages")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            msg = data[0]
            required_fields = ["id", "user_id", "user_name", "content", "created_at"]
            for field in required_fields:
                assert field in msg, f"Missing field: {field}"
            print(f"✓ Messages have all required fields: {required_fields}")
        else:
            print("⚠ No messages to validate fields")
    
    def test_messages_have_ttl_field(self, api_client):
        """Messages should have expire_at field for TTL (2 days)"""
        response = api_client.get(f"{BASE_URL}/api/chat/messages")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            msg = data[0]
            assert "expire_at" in msg, "Message should have expire_at field for TTL"
            print(f"✓ Messages have expire_at field for 2-day TTL")
        else:
            print("⚠ No messages to validate TTL field")


class TestOnlineUsers:
    """Tests for online users endpoint"""
    
    def test_get_online_users_returns_list(self, api_client):
        """GET /api/chat/online should return a list"""
        response = api_client.get(f"{BASE_URL}/api/chat/online")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/chat/online returned {len(data)} online users")


class TestBanStatus:
    """Tests for ban status endpoint"""
    
    def test_check_ban_status_not_banned(self, api_client, test_user_data):
        """GET /api/chat/ban-status should return banned: false for non-banned user"""
        user_id = test_user_data["user"]["id"]
        response = api_client.get(f"{BASE_URL}/api/chat/ban-status?user_id={user_id}")
        assert response.status_code == 200
        data = response.json()
        assert "banned" in data
        print(f"✓ Ban status check returned: {data}")


class TestAdminModeration:
    """Tests for admin moderation endpoints"""
    
    def test_delete_message_requires_auth(self, api_client):
        """DELETE /api/chat/messages/{id} should require authentication"""
        response = api_client.delete(f"{BASE_URL}/api/chat/messages/fake-id")
        assert response.status_code == 422  # Missing token parameter
        print("✓ DELETE message requires token parameter")
    
    def test_delete_message_requires_admin(self, api_client, test_user_data):
        """DELETE /api/chat/messages/{id} should require admin role"""
        token = test_user_data["access_token"]
        response = api_client.delete(f"{BASE_URL}/api/chat/messages/fake-id?token={token}")
        assert response.status_code == 403
        print("✓ DELETE message requires admin role")
    
    def test_delete_nonexistent_message(self, api_client, admin_token):
        """DELETE /api/chat/messages/{id} should return 404 for non-existent message"""
        response = api_client.delete(f"{BASE_URL}/api/chat/messages/nonexistent-id?token={admin_token}")
        assert response.status_code == 404
        print("✓ DELETE non-existent message returns 404")
    
    def test_ban_user_requires_auth(self, api_client):
        """POST /api/chat/ban should require authentication"""
        response = api_client.post(f"{BASE_URL}/api/chat/ban", json={
            "user_id": "fake-id",
            "reason": "test"
        })
        assert response.status_code == 422  # Missing token parameter
        print("✓ POST ban requires token parameter")
    
    def test_ban_user_requires_admin(self, api_client, test_user_data):
        """POST /api/chat/ban should require admin role"""
        token = test_user_data["access_token"]
        response = api_client.post(f"{BASE_URL}/api/chat/ban?token={token}", json={
            "user_id": "fake-id",
            "reason": "test"
        })
        assert response.status_code == 403
        print("✓ POST ban requires admin role")
    
    def test_ban_nonexistent_user(self, api_client, admin_token):
        """POST /api/chat/ban should return 404 for non-existent user"""
        response = api_client.post(f"{BASE_URL}/api/chat/ban?token={admin_token}", json={
            "user_id": "nonexistent-user-id",
            "reason": "test ban",
            "duration_hours": 1
        })
        assert response.status_code == 404
        print("✓ POST ban non-existent user returns 404")
    
    def test_get_bans_requires_admin(self, api_client, test_user_data):
        """GET /api/chat/bans should require admin role"""
        token = test_user_data["access_token"]
        response = api_client.get(f"{BASE_URL}/api/chat/bans?token={token}")
        assert response.status_code == 403
        print("✓ GET bans requires admin role")
    
    def test_get_bans_as_admin(self, api_client, admin_token):
        """GET /api/chat/bans should return list for admin"""
        response = api_client.get(f"{BASE_URL}/api/chat/bans?token={admin_token}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/chat/bans returned {len(data)} bans")
    
    def test_unban_requires_admin(self, api_client, test_user_data):
        """DELETE /api/chat/ban/{user_id} should require admin role"""
        token = test_user_data["access_token"]
        response = api_client.delete(f"{BASE_URL}/api/chat/ban/fake-id?token={token}")
        assert response.status_code == 403
        print("✓ DELETE unban requires admin role")


class TestBanWorkflow:
    """Tests for complete ban/unban workflow"""
    
    def test_ban_and_unban_user(self, api_client, admin_token, test_user_data):
        """Test complete ban and unban workflow"""
        user_id = test_user_data["user"]["id"]
        
        # Ban the user
        ban_response = api_client.post(f"{BASE_URL}/api/chat/ban?token={admin_token}", json={
            "user_id": user_id,
            "reason": "Test ban for automated testing",
            "duration_hours": 1
        })
        assert ban_response.status_code == 200
        ban_data = ban_response.json()
        assert "expires_at" in ban_data
        print(f"✓ User banned successfully, expires at: {ban_data['expires_at']}")
        
        # Check ban status
        status_response = api_client.get(f"{BASE_URL}/api/chat/ban-status?user_id={user_id}")
        assert status_response.status_code == 200
        status_data = status_response.json()
        assert status_data["banned"] == True
        print(f"✓ Ban status confirmed: {status_data}")
        
        # Unban the user
        unban_response = api_client.delete(f"{BASE_URL}/api/chat/ban/{user_id}?token={admin_token}")
        assert unban_response.status_code == 200
        print("✓ User unbanned successfully")
        
        # Verify unban
        verify_response = api_client.get(f"{BASE_URL}/api/chat/ban-status?user_id={user_id}")
        assert verify_response.status_code == 200
        verify_data = verify_response.json()
        assert verify_data["banned"] == False
        print(f"✓ Unban verified: {verify_data}")


class TestCannotBanAdmin:
    """Test that admins cannot be banned"""
    
    def test_cannot_ban_admin_user(self, api_client, admin_token):
        """POST /api/chat/ban should not allow banning admin users"""
        # Get admin user ID from token
        me_response = api_client.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert me_response.status_code == 200
        admin_id = me_response.json()["id"]
        
        # Try to ban admin
        ban_response = api_client.post(f"{BASE_URL}/api/chat/ban?token={admin_token}", json={
            "user_id": admin_id,
            "reason": "Test - should fail",
            "duration_hours": 1
        })
        assert ban_response.status_code == 400
        print("✓ Cannot ban admin users - returns 400")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
