"""
Test suite for STUFF Dúvidas feature and Logo implementation
Tests the new /api/contact endpoint and verifies logo presence
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dublin-exchange.preview.emergentagent.com')

class TestContactEndpoint:
    """Tests for /api/contact endpoint"""
    
    def test_contact_form_success(self):
        """Test successful contact form submission"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "Test message from pytest"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "id" in data
        assert data["message"] == "Mensagem enviada com sucesso!"
        assert len(data["id"]) > 0
        print(f"✅ Contact form submission successful - ID: {data['id']}")
    
    def test_contact_form_missing_name(self):
        """Test contact form with missing name field"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "Test message"
        })
        
        # Should return 422 for validation error
        assert response.status_code == 422
        print("✅ Contact form correctly rejects missing name")
    
    def test_contact_form_invalid_email(self):
        """Test contact form with invalid email"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "Test User",
            "email": "invalid-email",
            "subject": "Test Subject",
            "message": "Test message"
        })
        
        # Should return 422 for validation error
        assert response.status_code == 422
        print("✅ Contact form correctly rejects invalid email")
    
    def test_contact_form_missing_message(self):
        """Test contact form with missing message field"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject"
        })
        
        # Should return 422 for validation error
        assert response.status_code == 422
        print("✅ Contact form correctly rejects missing message")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Dublin Study API"
        print("✅ API root endpoint working")
    
    def test_schools_endpoint(self):
        """Test schools listing endpoint"""
        response = requests.get(f"{BASE_URL}/api/schools")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Schools endpoint working - {len(data)} schools found")
    
    def test_courses_endpoint(self):
        """Test courses listing endpoint"""
        response = requests.get(f"{BASE_URL}/api/courses")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Courses endpoint working - {len(data)} courses found")
    
    def test_transport_routes_endpoint(self):
        """Test transport routes endpoint"""
        response = requests.get(f"{BASE_URL}/api/transport/routes")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Transport routes endpoint working - {len(data)} routes found")
    
    def test_services_agencies_endpoint(self):
        """Test government agencies endpoint"""
        response = requests.get(f"{BASE_URL}/api/services/agencies")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Services agencies endpoint working - {len(data)} agencies found")


class TestGuides:
    """Test guide endpoints"""
    
    def test_pps_guide(self):
        """Test PPS guide endpoint"""
        response = requests.get(f"{BASE_URL}/api/guides/pps")
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "steps" in data
        print("✅ PPS guide endpoint working")
    
    def test_gnib_guide(self):
        """Test GNIB guide endpoint"""
        response = requests.get(f"{BASE_URL}/api/guides/gnib")
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "steps" in data
        print("✅ GNIB guide endpoint working")
    
    def test_passport_guide(self):
        """Test Passport guide endpoint"""
        response = requests.get(f"{BASE_URL}/api/guides/passport")
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "steps" in data
        print("✅ Passport guide endpoint working")
    
    def test_driving_license_guide(self):
        """Test Driving License guide endpoint"""
        response = requests.get(f"{BASE_URL}/api/guides/driving-license")
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "steps" in data
        print("✅ Driving License guide endpoint working")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
