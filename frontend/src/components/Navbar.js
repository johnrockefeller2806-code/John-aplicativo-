import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  Menu, 
  X, 
  Globe, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Building2, 
  Shield, 
  HelpCircle, 
  MessageCircle, 
  Camera, 
  Star, 
  Heart, 
  Plane,
  GraduationCap,
  Bus,
  FileText,
  BookOpen,
  Info
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isSchool, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isSchool) return '/school';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (isAdmin) return language === 'pt' ? 'Admin' : 'Admin';
    if (isSchool) return language === 'pt' ? 'Minha Escola' : 'My School';
    return t('nav_dashboard');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  // Main navigation links with icons and categories
  const mainNavLinks = [
    { 
      href: '/schools', 
      label: language === 'pt' ? 'Escolas' : 'Schools', 
      icon: GraduationCap,
      color: 'orange'
    },
    { 
      href: '/transport', 
      label: language === 'pt' ? 'Transporte' : 'Transport', 
      icon: Bus,
      color: 'orange'
    },
    { 
      href: '/tourism', 
      label: language === 'pt' ? 'Turismo' : 'Tourism', 
      icon: Camera,
      color: 'orange'
    },
    { 
      href: '/emergency', 
      label: language === 'pt' ? 'Emergência' : 'Emergency', 
      icon: Shield,
      color: 'orange'
    },
    { 
      href: '/services', 
      label: language === 'pt' ? 'Serviços' : 'Services', 
      icon: FileText,
      color: 'orange'
    },
    { 
      href: '/guia-estudante', 
      label: language === 'pt' ? 'Guia' : 'Guide', 
      icon: BookOpen,
      color: 'orange'
    },
    { 
      href: '/passagens', 
      label: language === 'pt' ? 'Passagens' : 'Flights', 
      icon: Plane,
      color: 'orange'
    },
    { 
      href: '/seguro', 
      label: language === 'pt' ? 'Seguro' : 'Insurance', 
      icon: Shield,
      color: 'orange'
    },
  ];

  const stuffNavLinks = [
    { 
      href: '/duvidas', 
      label: 'Dúvidas', 
      icon: HelpCircle,
      color: 'green'
    },
    { 
      href: '/chat', 
      label: 'Online', 
      icon: MessageCircle,
      color: 'green'
    },
    { 
      href: '/sobre', 
      label: language === 'pt' ? 'Sobre' : 'About', 
      icon: Heart,
      color: 'green'
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md" data-testid="navbar">
      {/* Top bar with logo and user actions */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3" data-testid="nav-logo">
              <img 
                src={LOGO_URL} 
                alt="STUFF Intercâmbio" 
                className="h-10 w-auto object-contain bg-white rounded-lg p-1"
              />
              <span className="text-white font-bold text-lg hidden sm:block">
                STUFF Intercâmbio
              </span>
            </Link>

            {/* Right side - Language and Auth */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-white hover:bg-orange-600 gap-1"
                data-testid="language-toggle"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{language === 'pt' ? 'PT' : 'EN'}</span>
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-orange-600 gap-2" data-testid="user-menu-trigger">
                      <Avatar className="h-7 w-7 border-2 border-white">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className={`text-xs ${isAdmin ? 'bg-amber-100 text-amber-700' : isSchool ? 'bg-purple-100 text-purple-700' : 'bg-white text-orange-600'}`}>
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="nav-profile">
                      <Camera className="h-4 w-4 mr-2" />
                      {language === 'pt' ? 'Meu Perfil' : 'My Profile'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(getDashboardLink())} data-testid="nav-dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {getDashboardLabel()}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600" data-testid="nav-logout">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('nav_logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-orange-600" data-testid="nav-login">
                      {t('nav_login')}
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold" data-testid="nav-register">
                        {t('nav_register')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate('/register')}>
                        <User className="h-4 w-4 mr-2" />
                        {language === 'pt' ? 'Como Estudante' : 'As Student'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/register-school')}>
                        <Building2 className="h-4 w-4 mr-2" />
                        {language === 'pt' ? 'Como Escola' : 'As School'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-white hover:bg-orange-600"
                data-testid="mobile-menu-button"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links Bar - Desktop */}
      <div className="hidden md:block bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Main Navigation */}
            <div className="flex items-center">
              {mainNavLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
                  data-testid={`nav-link-${link.href.slice(1)}`}
                >
                  <link.icon className="h-4 w-4 text-orange-500 group-hover:text-orange-600" />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Separator */}
              <div className="h-6 w-px bg-slate-300 mx-2" />
              
              {/* STUFF Links */}
              <div className="flex items-center bg-emerald-50 rounded-lg px-1">
                <span className="text-xs font-bold text-emerald-700 px-2">STUFF</span>
                {stuffNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 rounded-md transition-all duration-200"
                    data-testid={`nav-link-${link.href.slice(1)}`}
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-fade-in" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-4">
            {/* Main Navigation Section */}
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 px-2">
                {language === 'pt' ? 'Navegação' : 'Navigation'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="h-4 w-4 text-orange-500" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* STUFF Section */}
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 px-2">
                STUFF
              </p>
              <div className="flex flex-wrap gap-2">
                {stuffNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth Section for Mobile */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center py-2.5 text-sm font-medium text-orange-600 border-2 border-orange-600 rounded-xl hover:bg-orange-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav_login')}
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center py-2.5 text-sm font-medium text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav_register')}
                  </Link>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3 px-2 mb-3">
                  <Avatar className="h-10 w-10 border-2 border-orange-200">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={getDashboardLink()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-orange-600 border-2 border-orange-600 rounded-xl hover:bg-orange-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {getDashboardLabel()}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
