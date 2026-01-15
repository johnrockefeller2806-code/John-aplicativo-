import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Loader2, PartyPopper, GraduationCap, ArrowRight } from 'lucide-react';
import Confetti from '../components/Confetti';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const PlusSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { language } = useLanguage();
  const [status, setStatus] = useState('loading');
  const [showConfetti, setShowConfetti] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    }
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(`${API}/plus/status/${sessionId}`);
      
      if (response.data.payment_status === 'paid') {
        setStatus('success');
        setShowConfetti(true);
        // Update user context with new plan
        updateUser({ plan: 'plus', plan_purchased_at: new Date().toISOString() });
        
        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        // Poll again in 2 seconds
        setTimeout(checkPaymentStatus, 2000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {language === 'pt' ? 'Processando pagamento...' : 'Processing payment...'}
            </h2>
            <p className="text-slate-500">
              {language === 'pt' 
                ? 'Por favor, aguarde enquanto confirmamos seu pagamento.'
                : 'Please wait while we confirm your payment.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">
              {language === 'pt' ? 'Erro no pagamento' : 'Payment error'}
            </h2>
            <p className="text-slate-500 mb-6">
              {language === 'pt' 
                ? 'Houve um problema ao processar seu pagamento.'
                : 'There was a problem processing your payment.'}
            </p>
            <Button onClick={() => navigate('/schools')} className="w-full">
              {language === 'pt' ? 'Tentar novamente' : 'Try again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 flex items-center justify-center" data-testid="plus-success">
      {showConfetti && <Confetti />}
      
      <div className="max-w-lg w-full mx-4">
        <Card className="border-2 border-emerald-400 shadow-2xl shadow-emerald-500/20">
          <CardContent className="p-8 text-center">
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-16 w-auto object-contain mx-auto mb-6"
            />
            
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            
            <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">
              {language === 'pt' ? 'Parabéns!' : 'Congratulations!'} 🎉
            </h1>
            
            <p className="text-lg text-slate-600 mb-6">
              {language === 'pt' 
                ? 'Seu Plano PLUS foi ativado com sucesso!'
                : 'Your PLUS Plan has been successfully activated!'}
            </p>

            <div className="bg-emerald-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold mb-2">
                <PartyPopper className="h-5 w-5" />
                {language === 'pt' ? 'Você agora tem acesso a:' : 'You now have access to:'}
              </div>
              <ul className="text-sm text-emerald-600 space-y-1">
                <li>✅ {language === 'pt' ? 'Catálogo completo de escolas' : 'Complete school catalog'}</li>
                <li>✅ {language === 'pt' ? 'Matrículas online' : 'Online enrollment'}</li>
                <li>✅ {language === 'pt' ? 'Chat da comunidade' : 'Community chat'}</li>
                <li>✅ {language === 'pt' ? 'Guias exclusivos' : 'Exclusive guides'}</li>
              </ul>
            </div>

            <Button 
              onClick={() => navigate('/schools')}
              className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              data-testid="go-to-schools-btn"
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              {language === 'pt' ? 'Ver Escolas' : 'View Schools'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
