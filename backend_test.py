import requests
import sys
import json
from datetime import datetime

class DublinStudyAPITester:
    def __init__(self, base_url="https://dublin-exchange.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.school_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.user_id = None
        self.enrollment_id = None
        self.school_id = None
        self.course_id = None

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected: {expected_status})"
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f" - {response.text[:100]}"

            self.log_test(name, success, details)
            
            if success:
                try:
                    return response.json()
                except:
                    return {}
            return None

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return None

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_seed_database(self):
        """Seed the database with test data"""
        result = self.run_test("Seed Database", "POST", "seed", 200)
        if result:
            print(f"   Seeded: {result.get('schools', 0)} schools, {result.get('courses', 0)} courses")
        return result

    def test_user_registration(self):
        """Test user registration"""
        test_user = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!"
        }
        
        result = self.run_test("User Registration", "POST", "auth/register", 200, test_user)
        if result and 'access_token' in result:
            self.token = result['access_token']
            self.user_id = result['user']['id']
            print(f"   Registered user: {result['user']['name']}")
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        if not self.user_id:
            return False
            
        # Create a new user for login test
        login_user = {
            "name": "Login Test User",
            "email": f"login_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "LoginPass123!"
        }
        
        # Register first
        reg_result = self.run_test("Register for Login Test", "POST", "auth/register", 200, login_user)
        if not reg_result:
            return False
            
        # Now test login
        login_data = {
            "email": login_user["email"],
            "password": login_user["password"]
        }
        
        result = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        if result and 'access_token' in result:
            print(f"   Logged in user: {result['user']['name']}")
            return True
        return False

    def test_get_user_profile(self):
        """Test getting current user profile"""
        if not self.token:
            self.log_test("Get User Profile", False, "No auth token")
            return False
            
        result = self.run_test("Get User Profile", "GET", "auth/me", 200)
        if result:
            print(f"   Profile: {result.get('name', 'Unknown')}")
            return True
        return False

    def test_get_schools(self):
        """Test getting all schools"""
        result = self.run_test("Get Schools", "GET", "schools", 200)
        if result and isinstance(result, list):
            print(f"   Found {len(result)} schools")
            return result
        return None

    def test_get_school_detail(self, school_id="school-1"):
        """Test getting school details"""
        result = self.run_test("Get School Detail", "GET", f"schools/{school_id}", 200)
        if result:
            print(f"   School: {result.get('name', 'Unknown')}")
            return result
        return None

    def test_get_school_courses(self, school_id="school-1"):
        """Test getting courses for a school"""
        result = self.run_test("Get School Courses", "GET", f"schools/{school_id}/courses", 200)
        if result and isinstance(result, list):
            print(f"   Found {len(result)} courses for school")
            return result
        return None

    def test_get_all_courses(self):
        """Test getting all courses"""
        result = self.run_test("Get All Courses", "GET", "courses", 200)
        if result and isinstance(result, list):
            print(f"   Found {len(result)} total courses")
            return result
        return None

    def test_get_course_detail(self, course_id="course-1"):
        """Test getting course details"""
        result = self.run_test("Get Course Detail", "GET", f"courses/{course_id}", 200)
        if result:
            print(f"   Course: {result.get('name', 'Unknown')}")
            return result
        return None

    def test_create_enrollment(self, course_id="course-1"):
        """Test creating an enrollment"""
        if not self.token:
            self.log_test("Create Enrollment", False, "No auth token")
            return False
            
        start_date = "2025-02-10"
        result = self.run_test(
            "Create Enrollment", 
            "POST", 
            f"enrollments?course_id={course_id}&start_date={start_date}", 
            200
        )
        if result:
            self.enrollment_id = result.get('id')
            print(f"   Enrollment ID: {self.enrollment_id}")
            return True
        return False

    def test_get_user_enrollments(self):
        """Test getting user enrollments"""
        if not self.token:
            self.log_test("Get User Enrollments", False, "No auth token")
            return False
            
        result = self.run_test("Get User Enrollments", "GET", "enrollments", 200)
        if result and isinstance(result, list):
            print(f"   Found {len(result)} enrollments")
            return result
        return None

    def test_get_enrollment_detail(self):
        """Test getting enrollment details"""
        if not self.token or not self.enrollment_id:
            self.log_test("Get Enrollment Detail", False, "No auth token or enrollment ID")
            return False
            
        result = self.run_test("Get Enrollment Detail", "GET", f"enrollments/{self.enrollment_id}", 200)
        if result:
            print(f"   Enrollment: {result.get('course_name', 'Unknown')}")
            return True
        return False

    def test_create_checkout_session(self):
        """Test creating Stripe checkout session"""
        if not self.token or not self.enrollment_id:
            self.log_test("Create Checkout Session", False, "No auth token or enrollment ID")
            return False
            
        checkout_data = {
            "enrollment_id": self.enrollment_id,
            "origin_url": "https://dublin-exchange.preview.emergentagent.com"
        }
        
        result = self.run_test("Create Checkout Session", "POST", "payments/checkout", 200, checkout_data)
        if result and 'url' in result:
            print(f"   Checkout URL created: {result['url'][:50]}...")
            return result
        return None

    def test_transport_routes(self):
        """Test getting transport routes"""
        result = self.run_test("Get Transport Routes", "GET", "transport/routes", 200)
        if result and isinstance(result, list):
            print(f"   Found {len(result)} transport routes")
            return result
        return None

    def test_government_agencies(self):
        """Test getting government agencies"""
        result = self.run_test("Get Government Agencies", "GET", "services/agencies", 200)
        if result and isinstance(result, list):
            print(f"   Found {len(result)} agencies")
            return result
        return None

    def test_agencies_by_category(self, category="immigration"):
        """Test getting agencies by category"""
        result = self.run_test("Get Agencies by Category", "GET", f"services/agencies/{category}", 200)
        if result and isinstance(result, list):
            print(f"   Found {len(result)} {category} agencies")
            return result
        return None

    def test_pps_guide(self):
        """Test PPS guide endpoint"""
        result = self.run_test("Get PPS Guide", "GET", "guides/pps", 200)
        if result and 'title' in result:
            print(f"   Guide: {result.get('title', 'Unknown')}")
            return True
        return False

    def test_gnib_guide(self):
        """Test GNIB guide endpoint"""
        result = self.run_test("Get GNIB Guide", "GET", "guides/gnib", 200)
        if result and 'title' in result:
            print(f"   Guide: {result.get('title', 'Unknown')}")
            return True
        return False

    def test_admin_login(self):
        """Test admin login"""
        admin_credentials = {
            "email": "admin@dublinstudy.com",
            "password": "admin123"
        }
        
        result = self.run_test("Admin Login", "POST", "auth/login", 200, admin_credentials)
        if result and 'access_token' in result and result['user']['role'] == 'admin':
            self.admin_token = result['access_token']
            print(f"   Admin logged in: {result['user']['name']}")
            return True
        return False

    def test_admin_stats(self):
        """Test admin dashboard stats"""
        if not self.admin_token:
            self.log_test("Admin Stats", False, "No admin token")
            return False
            
        # Temporarily set admin token
        original_token = self.token
        self.token = self.admin_token
        
        result = self.run_test("Admin Stats", "GET", "admin/stats", 200)
        
        # Restore original token
        self.token = original_token
        
        if result:
            print(f"   Users: {result.get('total_users', 0)}, Schools: {result.get('total_schools', 0)}")
            return True
        return False

    def test_admin_get_schools(self):
        """Test admin get all schools"""
        if not self.admin_token:
            self.log_test("Admin Get Schools", False, "No admin token")
            return False
            
        original_token = self.token
        self.token = self.admin_token
        
        result = self.run_test("Admin Get Schools", "GET", "admin/schools", 200)
        
        self.token = original_token
        
        if result and isinstance(result, list):
            print(f"   Found {len(result)} schools for admin")
            return result
        return None

    def test_admin_approve_school(self, school_id):
        """Test admin approve school"""
        if not self.admin_token or not school_id:
            self.log_test("Admin Approve School", False, "No admin token or school ID")
            return False
            
        original_token = self.token
        self.token = self.admin_token
        
        result = self.run_test("Admin Approve School", "PUT", f"admin/schools/{school_id}/approve", 200)
        
        self.token = original_token
        
        if result:
            print(f"   Approved school: {school_id}")
            return True
        return False

    def test_admin_get_users(self):
        """Test admin get all users"""
        if not self.admin_token:
            self.log_test("Admin Get Users", False, "No admin token")
            return False
            
        original_token = self.token
        self.token = self.admin_token
        
        result = self.run_test("Admin Get Users", "GET", "admin/users", 200)
        
        self.token = original_token
        
        if result and isinstance(result, list):
            print(f"   Found {len(result)} users")
            return result
        return None

    def test_admin_get_enrollments(self):
        """Test admin get all enrollments"""
        if not self.admin_token:
            self.log_test("Admin Get Enrollments", False, "No admin token")
            return False
            
        original_token = self.token
        self.token = self.admin_token
        
        result = self.run_test("Admin Get Enrollments", "GET", "admin/enrollments", 200)
        
        self.token = original_token
        
        if result and isinstance(result, list):
            print(f"   Found {len(result)} enrollments")
            return result
        return None

    def test_admin_get_payments(self):
        """Test admin get all payments"""
        if not self.admin_token:
            self.log_test("Admin Get Payments", False, "No admin token")
            return False
            
        original_token = self.token
        self.token = self.admin_token
        
        result = self.run_test("Admin Get Payments", "GET", "admin/payments", 200)
        
        self.token = original_token
        
        if result and isinstance(result, list):
            print(f"   Found {len(result)} payments")
            return result
        return None

    def test_school_registration(self):
        """Test school registration"""
        test_school = {
            "name": f"Test School Owner {datetime.now().strftime('%H%M%S')}",
            "email": f"school_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "SchoolPass123!",
            "school_name": f"Test Academy {datetime.now().strftime('%H%M%S')}",
            "description": "Uma escola de teste para validação da API",
            "description_en": "A test school for API validation",
            "address": "123 Test Street, Dublin 1",
            "phone": "+353 1 234 5678"
        }
        
        result = self.run_test("School Registration", "POST", "auth/register-school", 200, test_school)
        if result and 'access_token' in result and result['user']['role'] == 'school':
            self.school_token = result['access_token']
            self.school_id = result['user']['school_id']
            print(f"   Registered school: {result['user']['name']}")
            return True
        return False

    def test_school_dashboard(self):
        """Test school dashboard"""
        if not self.school_token:
            self.log_test("School Dashboard", False, "No school token")
            return False
            
        original_token = self.token
        self.token = self.school_token
        
        result = self.run_test("School Dashboard", "GET", "school/dashboard", 200)
        
        self.token = original_token
        
        if result and 'school' in result and 'stats' in result:
            school = result['school']
            stats = result['stats']
            print(f"   School: {school.get('name', 'Unknown')}, Status: {school.get('status', 'Unknown')}")
            print(f"   Stats - Courses: {stats.get('total_courses', 0)}, Enrollments: {stats.get('total_enrollments', 0)}")
            return result
        return None

    def test_school_create_course_pending(self):
        """Test school create course while pending (should fail)"""
        if not self.school_token:
            self.log_test("School Create Course (Pending)", False, "No school token")
            return False
            
        original_token = self.token
        self.token = self.school_token
        
        course_data = {
            "name": "Curso de Teste",
            "name_en": "Test Course",
            "description": "Um curso de teste",
            "description_en": "A test course",
            "duration_weeks": 12,
            "hours_per_week": 15,
            "level": "all_levels",
            "price": 1500.00,
            "requirements": ["Passaporte válido"],
            "includes": ["Material didático"],
            "start_dates": ["2025-03-01"],
            "available_spots": 20
        }
        
        # This should fail with 403 since school is pending
        result = self.run_test("School Create Course (Pending)", "POST", "school/courses", 403, course_data)
        
        self.token = original_token
        
        # Success means it correctly rejected the request
        return result is None

    def test_school_create_course_approved(self):
        """Test school create course after approval"""
        if not self.school_token or not self.school_id:
            self.log_test("School Create Course (Approved)", False, "No school token or ID")
            return False
            
        # First approve the school using admin
        if not self.test_admin_approve_school(self.school_id):
            return False
            
        original_token = self.token
        self.token = self.school_token
        
        course_data = {
            "name": "Curso de Teste Aprovado",
            "name_en": "Approved Test Course",
            "description": "Um curso de teste após aprovação",
            "description_en": "A test course after approval",
            "duration_weeks": 12,
            "hours_per_week": 15,
            "level": "all_levels",
            "price": 1500.00,
            "requirements": ["Passaporte válido"],
            "includes": ["Material didático"],
            "start_dates": ["2025-03-01"],
            "available_spots": 20
        }
        
        result = self.run_test("School Create Course (Approved)", "POST", "school/courses", 200, course_data)
        
        self.token = original_token
        
        if result and 'id' in result:
            self.course_id = result['id']
            print(f"   Created course: {result.get('name', 'Unknown')}")
            return True
        return False

    def test_school_get_courses(self):
        """Test school get their courses"""
        if not self.school_token:
            self.log_test("School Get Courses", False, "No school token")
            return False
            
        original_token = self.token
        self.token = self.school_token
        
        result = self.run_test("School Get Courses", "GET", "school/courses", 200)
        
        self.token = original_token
        
        if result and isinstance(result, list):
            print(f"   Found {len(result)} courses for school")
            return result
        return None

    def test_school_get_enrollments(self):
        """Test school get their enrollments"""
        if not self.school_token:
            self.log_test("School Get Enrollments", False, "No school token")
            return False
            
        original_token = self.token
        self.token = self.school_token
        
        result = self.run_test("School Get Enrollments", "GET", "school/enrollments", 200)
        
        self.token = original_token
        
        if result and isinstance(result, list):
            print(f"   Found {len(result)} enrollments for school")
            return result
        return None

    def test_passport_guide(self):
        """Test passport guide endpoint"""
        result = self.run_test("Get Passport Guide", "GET", "guides/passport", 200)
        if result and 'title' in result:
            print(f"   Guide: {result.get('title', 'Unknown')}")
            return True
        return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Dublin Study API Tests (Phase 2)")
        print("=" * 50)
        
        # Basic API tests
        self.test_root_endpoint()
        self.test_seed_database()
        
        # Authentication tests
        self.test_user_registration()
        self.test_user_login()
        self.test_get_user_profile()
        
        # Admin tests
        print("\n📋 Testing Admin Functionality...")
        self.test_admin_login()
        self.test_admin_stats()
        admin_schools = self.test_admin_get_schools()
        self.test_admin_get_users()
        self.test_admin_get_enrollments()
        self.test_admin_get_payments()
        
        # School tests
        print("\n🏫 Testing School Functionality...")
        self.test_school_registration()
        self.test_school_dashboard()
        self.test_school_create_course_pending()  # Should fail
        self.test_school_create_course_approved()  # Should succeed after approval
        self.test_school_get_courses()
        self.test_school_get_enrollments()
        
        # Schools and courses tests
        print("\n📚 Testing Public School/Course APIs...")
        schools = self.test_get_schools()
        if schools and len(schools) > 0:
            self.test_get_school_detail(schools[0]['id'])
            self.test_get_school_courses(schools[0]['id'])
        
        courses = self.test_get_all_courses()
        if courses and len(courses) > 0:
            self.test_get_course_detail(courses[0]['id'])
            
            # Enrollment tests (requires auth)
            if self.token:
                self.test_create_enrollment(courses[0]['id'])
                self.test_get_user_enrollments()
                self.test_get_enrollment_detail()
                self.test_create_checkout_session()
        
        # Transport and services tests
        print("\n🚌 Testing Transport & Services...")
        self.test_transport_routes()
        self.test_government_agencies()
        self.test_agencies_by_category("immigration")
        
        # Guides tests
        print("\n📖 Testing Guides...")
        self.test_pps_guide()
        self.test_gnib_guide()
        self.test_passport_guide()
        
        # Print results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"❌ {self.tests_run - self.tests_passed} tests failed")
            return 1

def main():
    tester = DublinStudyAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())