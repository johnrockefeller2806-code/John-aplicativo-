import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { Building2, ArrowRight, Eye, EyeOff } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const SchoolRegister = () => {
  const navigate = useNavigate();
  const { registerSchool } = useAuth();
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    school_name: '',
    description: '',
    description_en: '',
    address: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await registerSchool(formData);
      toast.success(language === 'pt' ? 'Escola cadastrada! Aguarde aprovação.' : 'School registered! Await approval.');
      navigate('/school');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4" data-testid="school-register-page">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-16 w-auto object-contain mx-auto"
            />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-6 w-6 text-emerald-700" />
            <h1 className="font-serif text-3xl font-bold text-slate-900">
              {language === 'pt' ? 'Cadastrar Escola' : 'Register School'}
            </h1>
          </div>
          <p className="text-slate-500">
            {language === 'pt' 
              ? 'Cadastre sua escola na plataforma STUFF Intercâmbio' 
              : 'Register your school on STUFF Intercâmbio platform'}
          </p>
        </div>

        <Card className="border-slate-100 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{language === 'pt' ? 'Seu Nome' : 'Your Name'}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="João Silva"
                    required
                    className="h-12 rounded-xl"
                    data-testid="school-reg-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{language === 'pt' ? 'Telefone' : 'Phone'}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+353 1 234 5678"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="escola@email.com"
                  required
                  className="h-12 rounded-xl"
                  data-testid="school-reg-email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{language === 'pt' ? 'Senha' : 'Password'}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="h-12 rounded-xl pr-10"
                    data-testid="school-reg-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-2">
                <Label htmlFor="school_name">{language === 'pt' ? 'Nome da Escola' : 'School Name'}</Label>
                <Input
                  id="school_name"
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleChange}
                  placeholder="Dublin English Academy"
                  required
                  className="h-12 rounded-xl"
                  data-testid="school-reg-school-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{language === 'pt' ? 'Endereço' : 'Address'}</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 O'Connell Street, Dublin 1"
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{language === 'pt' ? 'Descrição (PT)' : 'Description (PT)'}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={language === 'pt' ? 'Descreva sua escola em português...' : 'Describe your school in Portuguese...'}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_en">{language === 'pt' ? 'Descrição (EN)' : 'Description (EN)'}</Label>
                <Textarea
                  id="description_en"
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  placeholder={language === 'pt' ? 'Descreva sua escola em inglês...' : 'Describe your school in English...'}
                  required
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-emerald-900 hover:bg-emerald-800 rounded-xl text-base"
                disabled={loading}
                data-testid="school-reg-submit"
              >
                {loading 
                  ? (language === 'pt' ? 'Cadastrando...' : 'Registering...') 
                  : (language === 'pt' ? 'Cadastrar Escola' : 'Register School')}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500">
                {language === 'pt' ? 'Já tem conta?' : 'Already have an account?'}{' '}
                <Link to="/login" className="text-emerald-700 hover:text-emerald-800 font-medium">
                  {language === 'pt' ? 'Entrar' : 'Login'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
