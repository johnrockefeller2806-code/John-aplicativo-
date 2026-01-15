import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  GraduationCap, 
  MessageCircle, 
  BookOpen, 
  Shield, 
  Star,
  Check,
  Loader2,
  Lock,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const PlusPaywall = () => {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const features = [
    {
      icon: GraduationCap,
      title: language === 'pt' ? 'Catálogo de Escolas' : 'School Catalog',
      description: language === 'pt' 
        ? 'Acesso completo a todas as escolas parceiras em Dublin'
        : 'Full access to all partner schools in Dublin'
    },
    {
      icon: BookOpen,
      title: language === 'pt' ? 'Matrículas Online' : 'Online Enrollment',
      description: language === 'pt'
        ? 'Realize sua matrícula diretamente pelo aplicativo'
        : 'Enroll directly through the app'
    },
    {
      icon: MessageCircle,
      title: language === 'pt' ? 'Chat da Comunidade' : 'Community Chat',
      description: language === 'pt'
        ? 'Conecte-se com outros brasileiros em Dublin'
        : 'Connect with other Brazilians in Dublin'
    },
    {
      icon: Shield,
      title: language === 'pt' ? 'Guias Completos' : 'Complete Guides',
      description: language === 'pt'
        ? 'PPS, GNIB, Passaporte, Carteira de Motorista e mais'
        : 'PPS, GNIB, Passport, Driving License and more'
    },
    {
      icon: Star,
      title: language === 'pt' ? 'Suporte Prioritário' : 'Priority Support',
      description: language === 'pt'
        ? 'Atendimento exclusivo para assinantes PLUS'
        : 'Exclusive support for PLUS subscribers'
    },
    {
      icon: Sparkles,
      title: language === 'pt' ? 'Acesso Vitalício' : 'Lifetime Access',
      description: language === 'pt'
        ? 'Pague uma vez, use para sempre!'
        : 'Pay once, use forever!'
    }
  ];

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error(language === 'pt' ? 'Faça login para continuar' : 'Please login to continue');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/plus/checkout`, {
        origin_url: window.location.origin
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(language === 'pt' ? 'Erro ao processar pagamento' : 'Error processing payment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900" data-testid="plus-paywall">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="flex justify-center mb-8">
          <img 
            src={LOGO_URL} 
            alt="STUFF Intercâmbio" 
            className="h-24 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-2xl p-3"
          />
        </div>
        
        <Badge className="bg-amber-500 text-white mb-4 text-sm px-4 py-1">
          <Lock className="h-3 w-3 mr-1" />
          {language === 'pt' ? 'CONTEÚDO EXCLUSIVO' : 'EXCLUSIVE CONTENT'}
        </Badge>
        
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
          {language === 'pt' ? 'Desbloqueie o Acesso Completo' : 'Unlock Full Access'}
        </h1>
        
        <p className="text-emerald-200 text-lg max-w-2xl mx-auto mb-8">
          {language === 'pt' 
            ? 'Para acessar o catálogo de escolas e realizar matrículas, você precisa do Plano PLUS.'
            : 'To access the school catalog and enroll in courses, you need the PLUS Plan.'}
        </p>

        {/* Pricing Card */}
        <Card className="max-w-md mx-auto border-2 border-amber-400 shadow-2xl shadow-amber-500/20 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-3 px-4">
            <span className="text-white font-bold text-lg">PLANO PLUS</span>
          </div>
          <CardContent className="p-8">
            <div className="mb-6">
              <span className="text-5xl font-bold text-slate-900">€49,90</span>
              <span className="text-slate-500 ml-2">
                {language === 'pt' ? 'pagamento único' : 'one-time payment'}
              </span>
            </div>
            
            <Button 
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 rounded-xl mb-4"
              data-testid="subscribe-plus-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {language === 'pt' ? 'Processando...' : 'Processing...'}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {language === 'pt' ? 'ASSINAR AGORA' : 'SUBSCRIBE NOW'}
                </>
              )}
            </Button>

            <p className="text-sm text-slate-500">
              {language === 'pt' 
                ? '🔒 Pagamento seguro via Stripe'
                : '🔒 Secure payment via Stripe'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-serif font-bold text-white text-center mb-12">
          {language === 'pt' ? 'O que você vai ter acesso:' : 'What you will have access to:'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <feature.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-emerald-200 text-sm">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-emerald-400 text-sm mb-2">
            {language === 'pt' ? 'Junte-se à comunidade' : 'Join the community'}
          </p>
          <h3 className="text-white text-2xl font-bold mb-4">
            {language === 'pt' 
              ? 'Milhares de brasileiros já realizaram seu sonho de estudar em Dublin'
              : 'Thousands of Brazilians have already achieved their dream of studying in Dublin'}
          </h3>
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="secondary" className="bg-white/10 text-white px-4 py-2">
              ✅ {language === 'pt' ? 'Sem taxa mensal' : 'No monthly fee'}
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white px-4 py-2">
              ✅ {language === 'pt' ? 'Acesso imediato' : 'Instant access'}
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white px-4 py-2">
              ✅ {language === 'pt' ? 'Garantia de 7 dias' : '7-day guarantee'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="text-center py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-white/70 hover:text-white"
        >
          {language === 'pt' ? '← Voltar' : '← Back'}
        </Button>
      </div>
    </div>
  );
};
