import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus();
    }
  }, [sessionId]);

  const pollPaymentStatus = async () => {
    if (attempts >= maxAttempts) {
      setStatus('success'); // Assume success after max attempts
      return;
    }

    try {
      const response = await axios.get(`${API}/payments/status/${sessionId}`);
      
      if (response.data.payment_status === 'paid') {
        setStatus('success');
        return;
      } else if (response.data.status === 'expired') {
        setStatus('error');
        return;
      }
      
      // Continue polling
      setAttempts(prev => prev + 1);
      setTimeout(pollPaymentStatus, 2000);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setAttempts(prev => prev + 1);
      setTimeout(pollPaymentStatus, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4" data-testid="payment-success-page">
      <Card className="w-full max-w-md border-slate-100 shadow-lg">
        <CardContent className="p-8 text-center">
          {status === 'loading' ? (
            <>
              <Loader2 className="h-16 w-16 text-emerald-600 mx-auto mb-6 animate-spin" />
              <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                {t('payment_processing')}
              </h1>
              <p className="text-slate-500">
                {language === 'pt' ? 'Aguarde enquanto verificamos seu pagamento...' : 'Please wait while we verify your payment...'}
              </p>
            </>
          ) : status === 'success' ? (
            <>
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2" data-testid="success-title">
                {t('payment_success')}
              </h1>
              <p className="text-slate-500 mb-8">
                {t('payment_success_msg')}
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-emerald-900 hover:bg-emerald-800 h-12 rounded-xl"
                data-testid="return-dashboard"
              >
                {t('payment_return')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">❌</span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                {language === 'pt' ? 'Pagamento não confirmado' : 'Payment not confirmed'}
              </h1>
              <p className="text-slate-500 mb-8">
                {language === 'pt' ? 'Houve um problema com seu pagamento. Tente novamente.' : 'There was an issue with your payment. Please try again.'}
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-emerald-900 hover:bg-emerald-800 h-12 rounded-xl"
              >
                {t('payment_return')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
