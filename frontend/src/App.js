import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Landing } from "./pages/Landing";
import { Schools } from "./pages/Schools";
import { SchoolDetail } from "./pages/SchoolDetail";
import { Login, Register } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { Transport } from "./pages/Transport";
import { Services } from "./pages/Services";
import { PPSGuide, GNIBGuide, PassportGuide, DrivingLicenseGuide } from "./pages/Guides";
import { AdminDashboard } from "./pages/AdminDashboard";
import { SchoolDashboard } from "./pages/SchoolDashboard";
import { SchoolRegister } from "./pages/SchoolRegister";
import { SchoolSubscription } from "./pages/SchoolSubscription";
import { StuffDuvidas } from "./pages/StuffDuvidas";
import { StudentGuide } from "./pages/StudentGuide";
import { About } from "./pages/About";
import { Chat } from "./pages/Chat";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="App min-h-screen flex flex-col">
          <BrowserRouter>
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/schools" element={<Schools />} />
                <Route path="/schools/:id" element={<SchoolDetail />} />
                <Route path="/transport" element={<Transport />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/pps" element={<PPSGuide />} />
                <Route path="/services/gnib" element={<GNIBGuide />} />
                <Route path="/services/passport" element={<PassportGuide />} />
                <Route path="/services/driving-license" element={<DrivingLicenseGuide />} />
                <Route path="/duvidas" element={<StuffDuvidas />} />
                <Route path="/guia-estudante" element={<StudentGuide />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/chat" element={<Chat />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-school" element={<SchoolRegister />} />
                
                {/* User Routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                
                {/* School Routes */}
                <Route path="/school" element={<SchoolDashboard />} />
                <Route path="/school/subscription" element={<SchoolSubscription />} />
                <Route path="/school/subscription/success" element={<SchoolSubscription />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
