import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { 
  Camera, 
  User, 
  Mail, 
  Save, 
  Loader2,
  ArrowLeft,
  Shield,
  CheckCircle
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(user?.name || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || null);

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  // Handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - accept all image types for mobile camera
    if (!file.type.startsWith('image/')) {
      toast.error(language === 'pt' 
        ? 'Por favor, selecione uma imagem.' 
        : 'Please select an image.');
      return;
    }

    // Validate file size (max 5MB for mobile photos)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'pt' 
        ? 'Arquivo muito grande. Máximo 5MB.' 
        : 'File too large. Maximum 5MB.');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewAvatar(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/auth/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        updateUser({ avatar: data.avatar });
        toast.success(language === 'pt' ? 'Foto atualizada!' : 'Photo updated!');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Error uploading photo');
        setPreviewAvatar(user?.avatar || null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(language === 'pt' ? 'Erro ao enviar foto' : 'Error uploading photo');
      setPreviewAvatar(user?.avatar || null);
    } finally {
      setUploading(false);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(language === 'pt' ? 'Nome é obrigatório' : 'Name is required');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: name.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data);
        toast.success(language === 'pt' ? 'Perfil atualizado!' : 'Profile updated!');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(language === 'pt' ? 'Erro ao atualizar perfil' : 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="profile-page">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold">
                  {language === 'pt' ? 'Meu Perfil' : 'My Profile'}
                </h1>
                <p className="text-emerald-200 text-sm">
                  {language === 'pt' ? 'Gerencie suas informações' : 'Manage your information'}
                </p>
              </div>
            </div>
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-12 w-auto bg-white/10 rounded-lg p-1 hidden sm:block"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {language === 'pt' ? 'Informações do Perfil' : 'Profile Information'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6">
            {/* Avatar Section - Mobile Optimized */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={previewAvatar} alt={user.name} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl md:text-3xl font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Upload button overlay - Always visible on mobile */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 p-2.5 md:p-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full shadow-lg transition-colors touch-manipulation"
                  data-testid="upload-avatar-btn"
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 md:h-6 md:w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  )}
                </button>
                
                {/* Hidden file input - NO capture to allow gallery access on mobile */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="avatar-input"
                />
              </div>
              
              {/* Instructions and button for mobile */}
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500 mb-3">
                  {language === 'pt' 
                    ? 'Toque para escolher da galeria ou tirar foto' 
                    : 'Tap to choose from gallery or take photo'}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="gap-2 h-12 px-6 text-base touch-manipulation"
                  data-testid="change-photo-btn"
                >
                  <Camera className="h-5 w-5" />
                  {language === 'pt' ? 'Alterar Foto' : 'Change Photo'}
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  {language === 'pt' ? 'Nome' : 'Name'}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'pt' ? 'Seu nome completo' : 'Your full name'}
                  className="h-12"
                  data-testid="profile-name-input"
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {language === 'pt' ? 'Email' : 'Email'}
                </Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="h-12 bg-slate-50"
                />
                <p className="text-xs text-slate-400">
                  {language === 'pt' ? 'O email não pode ser alterado' : 'Email cannot be changed'}
                </p>
              </div>

              {/* Role Badge */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-400" />
                  {language === 'pt' ? 'Tipo de Conta' : 'Account Type'}
                </Label>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                    user.role === 'admin' 
                      ? 'bg-amber-100 text-amber-700' 
                      : user.role === 'school'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                    {user.role === 'admin' ? 'Administrador' : user.role === 'school' ? 'Escola' : 'Estudante'}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving || name === user.name}
                className="bg-emerald-600 hover:bg-emerald-500 gap-2"
                data-testid="save-profile-btn"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {language === 'pt' ? 'Salvando...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {language === 'pt' ? 'Salvar Alterações' : 'Save Changes'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
