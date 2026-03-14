import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { processGoogleSession } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Use useRef to prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL fragment (hash)
        const hash = window.location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]*)/);
        
        if (!sessionIdMatch) {
          toast.error('Sessão inválida');
          navigate('/login', { replace: true });
          return;
        }

        const sessionId = sessionIdMatch[1];
        
        // Process the session with backend
        const user = await processGoogleSession(sessionId);
        
        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname);
        
        toast.success(`Bem-vindo, ${user.name}!`);
        
        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/admin', { replace: true, state: { user } });
        } else if (user.role === 'school') {
          navigate('/school', { replace: true, state: { user } });
        } else {
          navigate('/dashboard', { replace: true, state: { user } });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Falha na autenticação. Tente novamente.');
        navigate('/login', { replace: true });
      }
    };

    processAuth();
  }, [processGoogleSession, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900 mx-auto mb-4"></div>
        <p className="text-slate-600">Autenticando...</p>
      </div>
    </div>
  );
};
