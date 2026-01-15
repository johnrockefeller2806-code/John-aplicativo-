import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Heart,
  Users,
  Shield,
  BookOpen,
  Globe,
  Star,
  MessageCircle,
  Lightbulb,
  HandHeart,
  GraduationCap,
  MapPin,
  CheckCircle,
  Quote,
  Sparkles,
  Target,
  Eye
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const About = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: Shield,
      title: language === 'pt' ? 'Segurança' : 'Safety',
      desc: language === 'pt' 
        ? 'Informações verificadas e confiáveis para proteger você'
        : 'Verified and reliable information to protect you',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: Heart,
      title: language === 'pt' ? 'Acolhimento' : 'Welcome',
      desc: language === 'pt'
        ? 'Sabemos o que você está passando, já estivemos no seu lugar'
        : 'We know what you\'re going through, we\'ve been there',
      color: 'bg-red-100 text-red-700'
    },
    {
      icon: Users,
      title: language === 'pt' ? 'Comunidade' : 'Community',
      desc: language === 'pt'
        ? 'Feito por estudantes brasileiros, para estudantes brasileiros'
        : 'Made by Brazilian students, for Brazilian students',
      color: 'bg-green-100 text-green-700'
    },
    {
      icon: BookOpen,
      title: language === 'pt' ? 'Educação' : 'Education',
      desc: language === 'pt'
        ? 'Conteúdo educativo elaborado com responsabilidade'
        : 'Educational content created with responsibility',
      color: 'bg-purple-100 text-purple-700'
    },
  ];

  const stats = [
    { value: '1000+', label: language === 'pt' ? 'Estudantes ajudados' : 'Students helped' },
    { value: '4+', label: language === 'pt' ? 'Escolas parceiras' : 'Partner schools' },
    { value: '100%', label: language === 'pt' ? 'Gratuito' : 'Free' },
    { value: '24/7', label: language === 'pt' ? 'Disponível' : 'Available' },
  ];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="about-page">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4 border-white rounded-full" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-24 md:h-32 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-2xl p-4"
            />
          </div>
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            {language === 'pt' ? 'Feito por estudantes, para estudantes' : 'Made by students, for students'}
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6" data-testid="about-title">
            {language === 'pt' ? 'Quem Somos' : 'About Us'}
          </h1>
          <p className="text-emerald-100 text-xl max-w-3xl mx-auto">
            {language === 'pt' 
              ? 'Uma iniciativa de estudantes brasileiros na Europa, criada para orientar, proteger e apoiar quem está chegando.'
              : 'An initiative by Brazilian students in Europe, created to guide, protect and support newcomers.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        
        {/* Main Story Section */}
        <div className="mb-16">
          <Card className="border-none shadow-xl bg-gradient-to-br from-white to-emerald-50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left - Emotional Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-100 rounded-2xl">
                      <Heart className="h-8 w-8 text-emerald-700" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                        {language === 'pt' ? 'Nossa História' : 'Our Story'}
                      </h2>
                      <p className="text-emerald-600 text-sm font-medium">
                        {language === 'pt' ? 'Por que criamos o STUFF' : 'Why we created STUFF'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-slate-700">
                    <p className="text-lg leading-relaxed">
                      {language === 'pt'
                        ? 'Chegar à Europa para estudar é um grande passo — e a gente sabe que nem sempre é fácil confiar em tudo o que aparece por aí.'
                        : 'Coming to Europe to study is a big step — and we know it\'s not always easy to trust everything you find out there.'}
                    </p>
                    <p className="leading-relaxed">
                      {language === 'pt'
                        ? 'Este aplicativo foi criado por estudantes brasileiros que já passaram pelos mesmos desafios e decidiram ajudar quem está chegando agora. Aqui você encontra dicas reais, informações confiáveis e orientações importantes para evitar problemas desnecessários e se adaptar melhor à sua nova vida.'
                        : 'This app was created by Brazilian students who have been through the same challenges and decided to help those who are arriving now. Here you will find real tips, reliable information and important guidance to avoid unnecessary problems and better adapt to your new life.'}
                    </p>
                    <div className="pt-4">
                      <p className="text-xl font-semibold text-emerald-700 flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        {language === 'pt' 
                          ? 'Nosso objetivo é simples: te informar, te proteger e te apoiar nessa nova fase.'
                          : 'Our goal is simple: to inform, protect and support you in this new phase.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-6 text-2xl">
                    🤝🇧🇷
                  </div>
                </div>
                
                {/* Right - Visual Element */}
                <div className="bg-gradient-to-br from-emerald-700 to-teal-600 p-8 md:p-12 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Quote className="h-16 w-16 mx-auto mb-6 opacity-50" />
                    <blockquote className="text-xl md:text-2xl font-medium italic mb-6">
                      {language === 'pt'
                        ? '"Sabemos que a falta de informação pode gerar dificuldades e situações indesejadas. Por isso estamos aqui."'
                        : '"We know that lack of information can lead to difficulties and undesirable situations. That\'s why we\'re here."'}
                    </blockquote>
                    <p className="text-emerald-200 font-medium">
                      — {language === 'pt' ? 'Equipe STUFF Intercâmbio' : 'STUFF Exchange Team'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="border-slate-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Target className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {language === 'pt' ? 'Nossa Missão' : 'Our Mission'}
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {language === 'pt'
                  ? 'Auxiliar estudantes recém-chegados a evitar situações indesejadas, promover uma melhor adaptação e contribuir para uma experiência acadêmica e pessoal mais tranquila.'
                  : 'Help newly arrived students avoid undesirable situations, promote better adaptation and contribute to a smoother academic and personal experience.'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Eye className="h-6 w-6 text-purple-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {language === 'pt' ? 'Nossa Visão' : 'Our Vision'}
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {language === 'pt'
                  ? 'Ser a principal referência de apoio e informação confiável para estudantes brasileiros na Irlanda, criando uma comunidade unida e solidária.'
                  : 'Be the main reference for support and reliable information for Brazilian students in Ireland, creating a united and supportive community.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Founder Section - John Weslley */}
        <div className="mb-16">
          <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left - Photo/Avatar Area */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 border-4 border-white/30">
                    <span className="text-6xl md:text-7xl">👨‍🎓</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">John Weslley</h3>
                  <Badge className="bg-white/20 text-white border-white/30 mb-4">
                    {language === 'pt' ? 'Fundador & Criador' : 'Founder & Creator'}
                  </Badge>
                  <p className="text-emerald-100 text-sm">
                    🇧🇷 {language === 'pt' ? 'Estudante Brasileiro na Irlanda' : 'Brazilian Student in Ireland'} 🇮🇪
                  </p>
                </div>
                
                {/* Right - Message */}
                <div className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center">
                  <Quote className="h-10 w-10 text-emerald-500 mb-6 opacity-50" />
                  <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-6">
                    {language === 'pt'
                      ? '"Quando cheguei na Irlanda, percebi como a falta de informação confiável pode dificultar a vida de quem está começando. Por isso criei o STUFF — para que outros brasileiros não passem pelas mesmas dificuldades que eu passei."'
                      : '"When I arrived in Ireland, I realized how the lack of reliable information can make life difficult for those who are starting out. That\'s why I created STUFF — so that other Brazilians don\'t go through the same difficulties I went through."'}
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                    <p className="text-emerald-400 font-semibold">
                      — John Weslley
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {language === 'pt'
                        ? 'John Weslley é estudante brasileiro que vive na Irlanda e conhece de perto os desafios enfrentados por quem decide estudar no exterior. Com base em sua própria experiência e na de outros colegas, ele desenvolveu o STUFF Intercâmbio para ser um guia completo e confiável para a comunidade brasileira.'
                        : 'John Weslley is a Brazilian student living in Ireland who knows firsthand the challenges faced by those who decide to study abroad. Based on his own experience and that of other colleagues, he developed STUFF Exchange to be a complete and reliable guide for the Brazilian community.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <Badge className="bg-emerald-100 text-emerald-700 mb-4">
              {language === 'pt' ? 'O que nos move' : 'What drives us'}
            </Badge>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              {language === 'pt' ? 'Nossos Valores' : 'Our Values'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-4`}>
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-500 text-sm">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Formal Version - Institutional */}
        <Card className="border-slate-100 mb-16 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <GraduationCap className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-1">
                  {language === 'pt' ? 'Versão Institucional' : 'Institutional Version'}
                </Badge>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {language === 'pt' ? 'Apresentação Oficial' : 'Official Presentation'}
                </h3>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed text-lg">
                {language === 'pt'
                  ? 'Este aplicativo foi desenvolvido a partir da vivência de estudantes brasileiros na Europa. Sabemos que, infelizmente, nem todas as informações ou orientações disponíveis são confiáveis, especialmente para quem acabou de chegar.'
                  : 'This application was developed from the experience of Brazilian students in Europe. We know that, unfortunately, not all available information or guidance is reliable, especially for those who have just arrived.'}
              </p>
              <p className="text-slate-700 leading-relaxed">
                {language === 'pt'
                  ? 'Pensando nisso, estudantes brasileiros tomaram a iniciativa de criar esta plataforma com o objetivo de compartilhar orientações seguras, experiências reais e dicas essenciais. Nosso propósito é auxiliar estudantes recém-chegados a evitar situações indesejadas, promover uma melhor adaptação e contribuir para uma experiência acadêmica e pessoal mais tranquila.'
                  : 'With this in mind, Brazilian students took the initiative to create this platform with the aim of sharing safe guidance, real experiences and essential tips. Our purpose is to help newly arrived students avoid undesirable situations, promote better adaptation and contribute to a smoother academic and personal experience.'}
              </p>
              <p className="text-emerald-700 font-semibold">
                {language === 'pt'
                  ? 'Este é um conteúdo educativo, elaborado com responsabilidade, respeito e compromisso com a comunidade estudantil brasileira no exterior.'
                  : 'This is educational content, created with responsibility, respect and commitment to the Brazilian student community abroad.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
              {language === 'pt' ? 'STUFF em Números' : 'STUFF in Numbers'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-emerald-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <Badge className="bg-amber-100 text-amber-700 mb-4">
              {language === 'pt' ? 'Tudo em um só lugar' : 'Everything in one place'}
            </Badge>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              {language === 'pt' ? 'O que oferecemos' : 'What we offer'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, title: language === 'pt' ? 'Escolas de Inglês' : 'English Schools', desc: language === 'pt' ? 'Lista de escolas confiáveis com avaliações reais' : 'List of reliable schools with real reviews' },
              { icon: MapPin, title: language === 'pt' ? 'Guias de Documentação' : 'Documentation Guides', desc: language === 'pt' ? 'PPS, GNIB/IRP, Passaporte e mais' : 'PPS, GNIB/IRP, Passport and more' },
              { icon: Globe, title: language === 'pt' ? 'Transporte' : 'Transport', desc: language === 'pt' ? 'Bus, Luas, DART e Dublin Bikes' : 'Bus, Luas, DART and Dublin Bikes' },
              { icon: HandHeart, title: language === 'pt' ? 'Guia do Estudante' : 'Student Guide', desc: language === 'pt' ? 'Checklist, emprego, supermercados, serviços BR' : 'Checklist, jobs, supermarkets, BR services' },
              { icon: MessageCircle, title: language === 'pt' ? 'Chat da Comunidade' : 'Community Chat', desc: language === 'pt' ? 'Conecte-se com outros estudantes' : 'Connect with other students' },
              { icon: Lightbulb, title: language === 'pt' ? 'Dicas e FAQ' : 'Tips and FAQ', desc: language === 'pt' ? 'Perguntas frequentes respondidas' : 'Frequently asked questions answered' },
            ].map((item, index) => (
              <Card key={index} className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 rounded-xl flex-shrink-0">
                    <item.icon className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 border border-emerald-100">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-100 rounded-full">
              <Star className="h-10 w-10 text-emerald-700" />
            </div>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            {language === 'pt' ? 'Faça parte dessa comunidade!' : 'Be part of this community!'}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            {language === 'pt'
              ? 'Juntos somos mais fortes. Use o STUFF, compartilhe com outros brasileiros e ajude a construir uma comunidade cada vez mais unida e informada.'
              : 'Together we are stronger. Use STUFF, share with other Brazilians and help build an increasingly united and informed community.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/schools"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition-colors shadow-lg hover:shadow-xl"
            >
              <GraduationCap className="h-5 w-5" />
              {language === 'pt' ? 'Explorar Escolas' : 'Explore Schools'}
            </a>
            <a
              href="/guia-estudante"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-emerald-700 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              {language === 'pt' ? 'Ver Guia do Estudante' : 'View Student Guide'}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
