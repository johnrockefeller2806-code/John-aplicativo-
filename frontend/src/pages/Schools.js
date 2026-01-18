import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { Star, MapPin, Search, Filter, ArrowRight, Lock, Sparkles } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const Schools = () => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isPlusUser } = useAuth();
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schoolsRes, coursesRes] = await Promise.all([
        axios.get(`${API}/schools`),
        axios.get(`${API}/courses`)
      ]);
      setSchools(schoolsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinPrice = (schoolId) => {
    const schoolCourses = courses.filter(c => c.school_id === schoolId);
    if (schoolCourses.length === 0) return null;
    return Math.min(...schoolCourses.map(c => c.price));
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user needs to see paywall
  const showPaywall = !isPlusUser;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12" data-testid="schools-loading">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show Paywall if user is not PLUS
  if (showPaywall) {
    return (
      <div className="min-h-screen bg-slate-50" data-testid="schools-paywall">
        {/* Header */}
        <div className="bg-emerald-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="schools-title">
                  {t('schools_title')}
                </h1>
                <p className="text-emerald-200 text-lg max-w-2xl">
                  {t('schools_subtitle')}
                </p>
              </div>
              <img 
                src={LOGO_URL} 
                alt="STUFF Intercâmbio" 
                className="h-16 md:h-20 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-xl p-2 hidden sm:block"
              />
            </div>
          </div>
        </div>

        {/* Paywall Content */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Card className="border-2 border-amber-400 shadow-2xl overflow-hidden" data-testid="plus-paywall-card">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-white" />
                <span className="text-white font-bold text-lg">
                  {language === 'pt' ? 'CONTEÚDO EXCLUSIVO' : 'EXCLUSIVE CONTENT'}
                </span>
              </div>
              <Badge className="bg-white text-amber-600 font-bold">PLANO PLUS</Badge>
            </div>
            
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
                  {language === 'pt' 
                    ? 'Desbloqueie o acesso às escolas'
                    : 'Unlock access to schools'}
                </h2>
                <p className="text-slate-600 max-w-xl mx-auto">
                  {language === 'pt' 
                    ? 'Para ver o catálogo completo de escolas e realizar matrículas, você precisa do Plano PLUS.'
                    : 'To view the complete school catalog and enroll, you need the PLUS Plan.'}
                </p>
              </div>

              {/* Preview of schools (blurred) */}
              <div className="relative mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 filter blur-sm opacity-50 pointer-events-none">
                  {schools.slice(0, 4).map((school) => (
                    <Card key={school.id} className="overflow-hidden">
                      <div className="h-32 bg-slate-200">
                        <img 
                          src={school.image_url} 
                          alt={school.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{school.name}</h3>
                        <p className="text-sm text-slate-500">{school.address}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
                    <Lock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-slate-700 mb-2">
                      {schools.length} {language === 'pt' ? 'escolas disponíveis' : 'schools available'}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {language === 'pt' ? 'Assine o PLUS para desbloquear' : 'Subscribe to PLUS to unlock'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="inline-block bg-emerald-50 rounded-2xl px-8 py-6">
                  <span className="text-4xl font-bold text-emerald-700">€49,90</span>
                  <span className="text-slate-500 ml-2">
                    {language === 'pt' ? 'pagamento único' : 'one-time payment'}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: '🏫', text: language === 'pt' ? 'Todas as escolas' : 'All schools' },
                  { icon: '📝', text: language === 'pt' ? 'Matrículas online' : 'Online enrollment' },
                  { icon: '💬', text: language === 'pt' ? 'Chat comunidade' : 'Community chat' },
                  { icon: '♾️', text: language === 'pt' ? 'Acesso vitalício' : 'Lifetime access' }
                ].map((feature, i) => (
                  <div key={i} className="text-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-2xl">{feature.icon}</span>
                    <p className="text-sm text-slate-600 mt-1">{feature.text}</p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                {isAuthenticated ? (
                  <Button 
                    onClick={() => navigate('/plus')}
                    className="h-14 px-12 text-lg bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    data-testid="subscribe-plus-btn"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {language === 'pt' ? 'ASSINAR PLANO PLUS' : 'SUBSCRIBE TO PLUS'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Button 
                      onClick={() => navigate('/register')}
                      className="h-14 px-12 text-lg bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                      data-testid="register-btn"
                    >
                      {language === 'pt' ? 'CRIAR CONTA E ASSINAR' : 'CREATE ACCOUNT & SUBSCRIBE'}
                    </Button>
                    <p className="text-slate-500 text-sm">
                      {language === 'pt' ? 'Já tem conta?' : 'Already have an account?'}{' '}
                      <button 
                        onClick={() => navigate('/login')}
                        className="text-emerald-600 font-semibold hover:underline"
                      >
                        {language === 'pt' ? 'Faça login' : 'Login'}
                      </button>
                    </p>
                  </div>
                )}
              </div>

              <p className="text-center text-sm text-slate-400 mt-6">
                🔒 {language === 'pt' ? 'Pagamento seguro via Stripe' : 'Secure payment via Stripe'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Normal Schools Page for PLUS users
  return (
    <div className="min-h-screen bg-slate-50" data-testid="schools-page">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif text-4xl md:text-5xl font-bold" data-testid="schools-title">
                  {t('schools_title')}
                </h1>
                <Badge className="bg-amber-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  PLUS
                </Badge>
              </div>
              <p className="text-emerald-200 text-lg max-w-2xl">
                {t('schools_subtitle')}
              </p>
            </div>
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-16 md:h-20 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-xl p-2 hidden sm:block"
            />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 -mt-6">
        <Card className="border-none shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder={language === 'pt' ? 'Buscar escolas...' : 'Search schools...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  data-testid="schools-search"
                />
              </div>
              <Button variant="outline" className="h-12 px-6 rounded-xl gap-2">
                <Filter className="h-4 w-4" />
                {language === 'pt' ? 'Filtros' : 'Filters'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schools Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchools.map((school) => {
            const minPrice = getMinPrice(school.id);
            return (
              <Link to={`/schools/${school.id}`} key={school.id}>
                <Card 
                  className="group overflow-hidden border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  data-testid={`school-card-${school.id}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={school.image_url}
                      alt={school.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {school.accreditation?.slice(0, 2).map((acc, i) => (
                        <Badge key={i} className="bg-white/90 text-emerald-800 text-xs">
                          {acc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-serif font-semibold text-xl text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {school.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{school.rating}</span>
                        <span className="text-slate-400 text-xs">({school.reviews_count})</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {language === 'pt' ? school.description : school.description_en}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <MapPin className="h-4 w-4" />
                        {school.address}
                      </div>
                      {minPrice && (
                        <div className="text-right">
                          <span className="text-xs text-slate-400">{t('schools_from')}</span>
                          <span className="block font-semibold text-emerald-700">
                            €{minPrice.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-2">
                        {school.facilities?.slice(0, 3).map((facility, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-16" data-testid="no-schools">
            <p className="text-slate-500">
              {language === 'pt' ? 'Nenhuma escola encontrada.' : 'No schools found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
