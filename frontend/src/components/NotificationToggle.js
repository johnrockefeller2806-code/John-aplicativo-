import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import {
  Bell,
  BellOff,
  BellRing,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Smartphone
} from "lucide-react";

export const NotificationToggle = ({ variant = "button" }) => {
  const { token } = useAuth();
  const { lang } = useLanguage();
  const {
    isSupported,
    isSubscribed,
    permission,
    loading,
    error,
    subscribe,
    unsubscribe
  } = usePushNotifications(token);

  const handleToggle = async () => {
    if (isSubscribed) {
      const success = await unsubscribe();
      if (success) {
        toast.success(lang === "pt" ? "Notificações desativadas" : "Notifications disabled");
      } else {
        toast.error(lang === "pt" ? "Erro ao desativar" : "Error disabling");
      }
    } else {
      const success = await subscribe();
      if (success) {
        toast.success(lang === "pt" ? "Notificações ativadas!" : "Notifications enabled!");
      } else if (permission === "denied") {
        toast.error(
          lang === "pt" 
            ? "Permissão negada. Habilite nas configurações do navegador." 
            : "Permission denied. Enable in browser settings."
        );
      } else {
        toast.error(error || (lang === "pt" ? "Erro ao ativar" : "Error enabling"));
      }
    }
  };

  if (!isSupported) {
    if (variant === "card") {
      return (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3 text-slate-500">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">
                {lang === "pt" 
                  ? "Notificações push não suportadas neste navegador" 
                  : "Push notifications not supported in this browser"}
              </span>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  if (variant === "card") {
    return (
      <Card className={`border-0 shadow-sm ${isSubscribed ? "bg-emerald-50" : "bg-white"}`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isSubscribed ? "bg-emerald-100" : "bg-slate-100"
              }`}>
                {isSubscribed ? (
                  <BellRing className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Bell className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className={`font-medium ${isSubscribed ? "text-emerald-800" : "text-slate-800"}`}>
                  {lang === "pt" ? "Notificações Push" : "Push Notifications"}
                </p>
                <p className="text-sm text-slate-500">
                  {isSubscribed 
                    ? (lang === "pt" ? "Ativadas - você receberá alertas" : "Enabled - you'll receive alerts")
                    : (lang === "pt" ? "Desativadas" : "Disabled")}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleToggle}
              disabled={loading}
              variant={isSubscribed ? "outline" : "default"}
              className={`rounded-full ${
                isSubscribed 
                  ? "border-emerald-300 text-emerald-700 hover:bg-emerald-100" 
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
              data-testid="notification-toggle-btn"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSubscribed ? (
                <>
                  <BellOff className="w-4 h-4 mr-2" />
                  {lang === "pt" ? "Desativar" : "Disable"}
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  {lang === "pt" ? "Ativar" : "Enable"}
                </>
              )}
            </Button>
          </div>
          
          {permission === "denied" && (
            <div className="mt-3 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">
                {lang === "pt" 
                  ? "Notificações bloqueadas. Clique no ícone de cadeado na barra de endereço para habilitar." 
                  : "Notifications blocked. Click the lock icon in the address bar to enable."}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Button variant (default)
  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant="ghost"
      size="sm"
      className={`rounded-full ${isSubscribed ? "text-emerald-600" : "text-slate-500"}`}
      title={isSubscribed 
        ? (lang === "pt" ? "Notificações ativadas" : "Notifications enabled")
        : (lang === "pt" ? "Ativar notificações" : "Enable notifications")}
      data-testid="notification-toggle-btn"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isSubscribed ? (
        <BellRing className="w-5 h-5" />
      ) : (
        <Bell className="w-5 h-5" />
      )}
    </Button>
  );
};

// Inline notification prompt component
export const NotificationPrompt = ({ onDismiss }) => {
  const { token } = useAuth();
  const { lang } = useLanguage();
  const { isSupported, isSubscribed, subscribe, loading } = usePushNotifications(token);
  const [dismissed, setDismissed] = useState(false);

  if (!isSupported || isSubscribed || dismissed) {
    return null;
  }

  const handleEnable = async () => {
    const success = await subscribe();
    if (success) {
      toast.success(lang === "pt" ? "Notificações ativadas!" : "Notifications enabled!");
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 mb-6 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold">
            {lang === "pt" ? "Ativar Notificações" : "Enable Notifications"}
          </h3>
          <p className="text-emerald-100 text-sm">
            {lang === "pt" 
              ? "Receba alertas quando seu passaporte estiver pronto!" 
              : "Get alerts when your passport is ready!"}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {lang === "pt" ? "Depois" : "Later"}
          </Button>
          <Button
            onClick={handleEnable}
            disabled={loading}
            size="sm"
            className="bg-white text-emerald-700 hover:bg-emerald-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Bell className="w-4 h-4 mr-1" />
                {lang === "pt" ? "Ativar" : "Enable"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToggle;
