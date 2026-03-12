import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { QRCodeSVG } from "qrcode.react";
import {
  Globe,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const PassportView = () => {
  const { token } = useParams();
  const { lang } = useLanguage();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover, 1 = data page, 2 = course page

  useEffect(() => {
    fetchPassport();
  }, [token]);

  const fetchPassport = async () => {
    try {
      const response = await fetch(`${API}/passport/view/${token}`);
      if (response.ok) {
        const data = await response.json();
        setPassport(data);
      } else {
        setError(lang === "pt" ? "Passaporte não encontrado" : "Passport not found");
      }
    } catch (error) {
      setError(lang === "pt" ? "Erro ao carregar passaporte" : "Error loading passport");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).toUpperCase();
  };

  const nextPage = () => {
    if (currentPage < 2) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-slate-800 mb-2">
            {lang === "pt" ? "Passaporte Inválido" : "Invalid Passport"}
          </h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const getVerificationUrl = () => {
    return `${window.location.origin}/passport/view/${token}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center p-4">
      {/* Navigation Arrows */}
      <button
        onClick={prevPage}
        disabled={currentPage === 0}
        className={`fixed left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all z-20 ${
          currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20"
        }`}
        data-testid="prev-page-btn"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextPage}
        disabled={currentPage === 2}
        className={`fixed right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all z-20 ${
          currentPage === 2 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20"
        }`}
        data-testid="next-page-btn"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Page Indicator */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium z-20">
        {currentPage + 1} / 3
      </div>

      {/* Passport Container */}
      <div className="relative w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
        
        {/* Cover Page */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            currentPage === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
          }`}
        >
          <div 
            className="bg-gradient-to-b from-[#1e3a5f] to-[#0f2744] rounded-3xl shadow-2xl overflow-hidden"
            style={{ aspectRatio: "3/4" }}
            data-testid="passport-cover"
          >
            {/* Gold Border Effect */}
            <div className="absolute inset-2 border border-amber-400/30 rounded-2xl pointer-events-none"></div>
            
            <div className="h-full flex flex-col items-center justify-center p-8 text-center relative">
              {/* Header Text */}
              <p className="text-amber-400/80 text-sm tracking-[0.3em] mb-2">
                STUFF INTERCÂMBIO
              </p>
              
              {/* Main Title */}
              <h1 className="text-amber-400 text-3xl md:text-4xl tracking-[0.2em] font-light mb-8">
                PASSPORT
              </h1>
              
              {/* Globe Icon */}
              <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-amber-400/60 rounded-full flex items-center justify-center mb-8">
                <Globe className="w-12 h-12 md:w-16 md:h-16 text-amber-400/80" />
              </div>
              
              {/* Country/Region */}
              <div className="text-center">
                <p className="text-amber-400 text-xl md:text-2xl tracking-wider mb-1">
                  International
                </p>
                <p className="text-amber-400 text-xl md:text-2xl tracking-wider">
                  Student
                </p>
              </div>
              
              {/* STUFF Logo/Badge */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-12 h-12 bg-amber-400/20 rounded-lg flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-xs">STUFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Page */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            currentPage === 1 ? "opacity-100 translate-x-0" : currentPage === 0 ? "opacity-0 translate-x-full pointer-events-none" : "opacity-0 -translate-x-full pointer-events-none"
          }`}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            style={{ aspectRatio: "3/4" }}
            data-testid="passport-data-page"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] px-6 py-4 flex items-center justify-between">
              <ChevronLeft className="w-5 h-5 text-white/50" />
              <Globe className="w-6 h-6 text-amber-400" />
              <div className="w-5 h-5"></div>
            </div>

            {/* Country Header */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">STUFF Intercâmbio</span>
              <span className="text-slate-400 text-sm">Passport</span>
            </div>

            {/* Photo Section */}
            <div className="px-6 py-4">
              <div className="relative w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-inner">
                {passport.user_avatar ? (
                  <img
                    src={passport.user_avatar}
                    alt={passport.user_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-200 to-slate-300">
                    <span className="text-4xl font-light text-slate-400">
                      {passport.user_name?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
                {/* Nationality Badge */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#1e3a5f] text-white text-center py-1 text-xs font-medium">
                  {passport.user_nationality?.substring(0, 3).toUpperCase() || "BRA"}
                </div>
              </div>
            </div>

            {/* Data Fields */}
            <div className="px-6 pb-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">Surname</p>
                <p className="text-slate-800 font-semibold">{passport.user_name?.split(' ').slice(-1)[0]?.toUpperCase() || "-"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">Nationality</p>
                <p className="text-slate-800 font-semibold">{passport.user_nationality?.toUpperCase() || "BRAZIL"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Given Name</p>
                <p className="text-slate-800 font-semibold">{passport.user_name?.split(' ').slice(0, -1).join(' ')?.toUpperCase() || "-"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">Date of Issue</p>
                <p className="text-slate-800 font-semibold">{formatDate(passport.issued_at)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">Type</p>
                <p className="text-slate-800 font-semibold">S</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">Date of Expiration</p>
                <p className="text-slate-800 font-semibold">{formatDate(passport.valid_until)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">Passport Number</p>
                <p className="text-slate-800 font-semibold text-xs">{passport.enrollment_number}</p>
              </div>
            </div>

            {/* MRZ Code */}
            <div className="px-6 pb-4 mt-auto">
              <div className="bg-slate-100 rounded-lg p-3 font-mono text-xs text-slate-600 leading-relaxed">
                <p>P&lt;{passport.user_nationality?.substring(0, 3).toUpperCase() || "BRA"}&lt;{passport.user_name?.split(' ').slice(-1)[0]?.toUpperCase()}&lt;{passport.user_name?.split(' ')[0]?.toUpperCase()}&lt;&lt;</p>
                <p>{passport.enrollment_number?.replace(/-/g, '')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course/School Page */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            currentPage === 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          }`}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            style={{ aspectRatio: "3/4" }}
            data-testid="passport-course-page"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] px-6 py-4 flex items-center justify-between">
              <ChevronLeft className="w-5 h-5 text-white/50" />
              <Globe className="w-6 h-6 text-amber-400" />
              <div className="w-5 h-5"></div>
            </div>

            {/* Title */}
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-center text-slate-400 text-sm uppercase tracking-wider">Enrollment Details</h2>
            </div>

            {/* School Info */}
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">School</p>
              <p className="text-slate-800 font-semibold text-lg">{passport.school_name}</p>
              <p className="text-slate-500 text-sm">{passport.school_address}</p>
            </div>

            {/* Course Info */}
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Course</p>
              <p className="text-slate-800 font-semibold">{passport.course_name}</p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-slate-400 text-xs">Start Date</p>
                  <p className="text-slate-700 font-medium">{formatDate(passport.course_start_date)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">End Date</p>
                  <p className="text-slate-700 font-medium">{formatDate(passport.course_end_date)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Duration</p>
                  <p className="text-slate-700 font-medium">{passport.course_duration_weeks} weeks</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Schedule</p>
                  <p className="text-slate-700 font-medium">{passport.course_schedule}</p>
                </div>
              </div>
            </div>

            {/* QR Code & Status */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {passport.status === "active" ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">ACTIVE</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">INACTIVE</span>
                  </div>
                )}
              </div>
              
              {/* QR Code */}
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <QRCodeSVG
                  value={getVerificationUrl()}
                  size={80}
                  level="M"
                  data-testid="passport-qrcode"
                />
              </div>
            </div>

            {/* Verification Badge */}
            <div className="px-6 pb-4">
              <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-emerald-800 font-medium text-sm">Verified Document</p>
                  <p className="text-emerald-600 text-xs">Scan QR code to verify authenticity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[0, 1, 2].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentPage === page ? "bg-amber-400 w-6" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PassportView;
