import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  FileText, 
  Building2, 
  Plane,
  CreditCard,
  ArrowRight,
  MapPin,
  Phone,
  Globe,
  Clock,
  Car,
  Landmark,
  Smartphone,
  ExternalLink,
  MapPinned,
  Stethoscope,
  Wifi,
  Hospital,
  Pill,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const Services = () => {
  const { t, language } = useLanguage();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await axios.get(`${API}/services/agencies`);
      setAgencies(response.data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const guides = [
    {
      icon: CreditCard,
      title: t('services_pps'),
      description: t('services_pps_desc'),
      href: '/services/pps',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: FileText,
      title: t('services_gnib'),
      description: t('services_gnib_desc'),
      href: '/services/gnib',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      icon: Plane,
      title: t('services_passport'),
      description: t('services_passport_desc'),
      href: '/services/passport',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      icon: Car,
      title: language === 'pt' ? 'Carteira de Motorista' : "Driver's License",
      description: language === 'pt' ? 'Como tirar carteira na Irlanda' : 'How to get a license in Ireland',
      href: '/services/driving-license',
      color: 'bg-green-100 text-green-700',
    },
  ];

  // Banks data
  const banks = {
    traditional: [
      {
        id: 'aib',
        name: 'AIB - Allied Irish Banks',
        logo: '🏦',
        type: language === 'pt' ? 'Banco Tradicional' : 'Traditional Bank',
        description: language === 'pt' 
          ? 'Um dos maiores bancos da Irlanda. Oferece conta estudante com benefícios especiais e app mobile completo.'
          : 'One of Ireland\'s largest banks. Offers student account with special benefits and complete mobile app.',
        bookingUrl: 'https://aib.ie/ways-to-bank/appointments',
        website: 'https://aib.ie',
        features: language === 'pt' 
          ? ['Conta estudante gratuita', 'App mobile', 'Cartão de débito', 'Internet banking']
          : ['Free student account', 'Mobile app', 'Debit card', 'Internet banking'],
        branches: {
          'Dublin City Centre': ['66 Grafton Street', '7/12 Dame Street', '1 Lower O\'Connell Street'],
          'Dublin Norte': ['Unit 9/10 Omni Shopping Centre, Santry', '45 Main Street, Swords'],
          'Dublin Sul': ['46 George\'s Street, Dun Laoghaire', 'Dundrum Town Centre']
        }
      },
      {
        id: 'boi',
        name: 'Bank of Ireland',
        logo: '🏛️',
        type: language === 'pt' ? 'Banco Tradicional' : 'Traditional Bank',
        description: language === 'pt'
          ? 'Banco histórico da Irlanda, fundado em 1783. Excelente para estudantes internacionais com suporte dedicado.'
          : 'Historic Irish bank, founded in 1783. Excellent for international students with dedicated support.',
        bookingUrl: 'https://personalbanking.bankofireland.com/branch-appointments/',
        website: 'https://www.bankofireland.com',
        features: language === 'pt'
          ? ['Conta estudante', 'Atendimento em português', 'App 365', 'Sem taxas para estudantes']
          : ['Student account', 'Portuguese support', '365 App', 'No fees for students'],
        branches: {
          'Dublin City Centre': ['College Green (sede histórica)', '6 Lower O\'Connell Street', '88 Grafton Street'],
          'Dublin Norte': ['Drumcondra Road Upper', 'Main Street, Swords'],
          'Dublin Sul': ['106 Lower George\'s Street, Dun Laoghaire', 'Dundrum Town Centre']
        }
      }
    ],
    digital: [
      {
        id: 'revolut',
        name: 'Revolut',
        logo: '💳',
        type: language === 'pt' ? 'Banco Digital' : 'Digital Bank',
        description: language === 'pt'
          ? 'Banco digital europeu sem taxas de manutenção. Perfeito para receber salário e fazer transferências internacionais com câmbio justo.'
          : 'European digital bank with no maintenance fees. Perfect for receiving salary and making international transfers with fair exchange rates.',
        bookingUrl: 'https://www.revolut.com/app/',
        website: 'https://www.revolut.com',
        features: language === 'pt'
          ? ['Sem taxa de manutenção', 'Câmbio sem spread até €1000/mês', 'Cartão virtual e físico', 'Transferências instantâneas']
          : ['No maintenance fee', 'No spread exchange up to €1000/month', 'Virtual and physical card', 'Instant transfers'],
        branches: null // Digital only
      }
    ]
  };

  const [selectedRegion, setSelectedRegion] = useState('Dublin City Centre');
  const regions = ['Dublin City Centre', 'Dublin Norte', 'Dublin Sul'];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12" data-testid="services-loading">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="services-page">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="services-title">
                {t('services_title')}
              </h1>
              <p className="text-emerald-200 text-lg max-w-2xl">
                {t('services_subtitle')}
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
        {/* Guides Section */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-6">
            {language === 'pt' ? 'Guias Essenciais' : 'Essential Guides'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, index) => (
              <Link to={guide.href} key={index}>
                <Card 
                  className="group h-full border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  data-testid={`guide-card-${index}`}
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl ${guide.color} flex items-center justify-center mb-4`}>
                      <guide.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center text-emerald-700 text-sm font-medium">
                      {t('learn_more')}
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Banks Section */}
        <div className="mb-12" data-testid="banks-section">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Landmark className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-900">
                {language === 'pt' ? 'Bancos na Irlanda' : 'Banks in Ireland'}
              </h2>
              <p className="text-slate-500 text-sm">
                {language === 'pt' ? 'Abra sua conta bancária para receber seu salário' : 'Open your bank account to receive your salary'}
              </p>
            </div>
          </div>

          {/* Region Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPinned className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {language === 'pt' ? 'Filtrar por região:' : 'Filter by region:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedRegion === region
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                  data-testid={`region-filter-${region.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Traditional Banks */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg text-slate-800">
                {language === 'pt' ? 'Bancos Tradicionais' : 'Traditional Banks'}
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {banks.traditional.map((bank) => (
                <Card 
                  key={bank.id} 
                  className="border-slate-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  data-testid={`bank-card-${bank.id}`}
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700" />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{bank.logo}</span>
                        <div>
                          <h4 className="font-semibold text-slate-900">{bank.name}</h4>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {bank.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4">{bank.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                        {language === 'pt' ? 'Benefícios' : 'Benefits'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {bank.features.map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {bank.branches && bank.branches[selectedRegion] && (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {language === 'pt' ? `Agências em ${selectedRegion}` : `Branches in ${selectedRegion}`}
                        </p>
                        <ul className="space-y-1">
                          {bank.branches[selectedRegion].map((branch, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              {branch}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <a
                        href={bank.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors"
                        data-testid={`book-appointment-${bank.id}`}
                      >
                        <Clock className="h-4 w-4" />
                        {language === 'pt' ? 'Agendar Abertura' : 'Book Appointment'}
                      </a>
                      <a
                        href={bank.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Site
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Digital Banks */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-lg text-slate-800">
                {language === 'pt' ? 'Bancos Digitais' : 'Digital Banks'}
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {banks.digital.map((bank) => (
                <Card 
                  key={bank.id} 
                  className="border-slate-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  data-testid={`bank-card-${bank.id}`}
                >
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{bank.logo}</span>
                        <div>
                          <h4 className="font-semibold text-slate-900">{bank.name}</h4>
                          <Badge variant="secondary" className="text-xs mt-1 bg-purple-100 text-purple-700">
                            {bank.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4">{bank.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                        {language === 'pt' ? 'Benefícios' : 'Benefits'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {bank.features.map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <Smartphone className="h-4 w-4 inline mr-1" />
                        {language === 'pt' 
                          ? '100% Digital - Abra sua conta pelo app em minutos, sem ir a agência!'
                          : '100% Digital - Open your account via app in minutes, no branch visit needed!'}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <a
                        href={bank.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                        data-testid={`download-app-${bank.id}`}
                      >
                        <Smartphone className="h-4 w-4" />
                        {language === 'pt' ? 'Baixar App' : 'Download App'}
                      </a>
                      <a
                        href={bank.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Site
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips Box */}
          <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              💡 {language === 'pt' ? 'Dicas Importantes' : 'Important Tips'}
            </h4>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                {language === 'pt' 
                  ? 'Para abrir conta em banco tradicional, você precisará do PPS Number e comprovante de endereço.'
                  : 'To open an account at a traditional bank, you will need your PPS Number and proof of address.'}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                {language === 'pt'
                  ? 'O Revolut pode ser aberto apenas com passaporte - ideal para usar enquanto espera o PPS.'
                  : 'Revolut can be opened with just a passport - ideal to use while waiting for your PPS.'}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                {language === 'pt'
                  ? 'Muitos empregadores na Irlanda aceitam pagamento via Revolut!'
                  : 'Many employers in Ireland accept payment via Revolut!'}
              </li>
            </ul>
          </div>
        </div>

        {/* Health Section */}
        <div className="mb-12" data-testid="health-section">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-xl">
              <Stethoscope className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-900">
                {language === 'pt' ? 'Saúde na Irlanda' : 'Health in Ireland'}
              </h2>
              <p className="text-slate-500 text-sm">
                {language === 'pt' ? 'Sistema de saúde e onde buscar atendimento' : 'Healthcare system and where to seek treatment'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Emergency Card */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-600 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900">{language === 'pt' ? 'Emergência' : 'Emergency'}</h3>
                    <p className="text-3xl font-bold text-red-600">999 / 112</p>
                  </div>
                </div>
                <p className="text-sm text-red-800">
                  {language === 'pt' 
                    ? 'Ligue para emergências médicas, bombeiros ou polícia. Gratuito de qualquer telefone.'
                    : 'Call for medical emergencies, fire or police. Free from any phone.'}
                </p>
              </CardContent>
            </Card>

            {/* GP Card */}
            <Card className="border-slate-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">GP (Clínico Geral)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {language === 'pt' 
                    ? 'Médico de família para consultas de rotina. Custo médio: €50-70 por consulta.'
                    : 'Family doctor for routine consultations. Average cost: €50-70 per visit.'}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">{language === 'pt' ? 'Precisa de agendamento' : 'Appointment needed'}</Badge>
                  <Badge variant="secondary" className="text-xs">{language === 'pt' ? 'Receitas médicas' : 'Prescriptions'}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pharmacy Card */}
            <Card className="border-slate-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Pill className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">{language === 'pt' ? 'Farmácias' : 'Pharmacies'}</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {language === 'pt' 
                    ? 'Boots, LloydsPharmacy e McCabes são as principais redes. Algumas têm atendimento 24h.'
                    : 'Boots, LloydsPharmacy and McCabes are the main chains. Some have 24h service.'}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">Boots</Badge>
                  <Badge variant="secondary" className="text-xs">LloydsPharmacy</Badge>
                  <Badge variant="secondary" className="text-xs">McCabes</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hospitals */}
          <Card className="border-slate-100 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Hospital className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-slate-900">{language === 'pt' ? 'Hospitais Principais em Dublin' : 'Main Hospitals in Dublin'}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Mater Hospital', location: 'Eccles Street', type: 'A&E' },
                  { name: "St. James's Hospital", location: 'James Street', type: 'A&E' },
                  { name: 'Beaumont Hospital', location: 'Beaumont', type: 'A&E' },
                  { name: "St. Vincent's Hospital", location: 'Elm Park', type: 'A&E' },
                  { name: 'Tallaght Hospital', location: 'Tallaght', type: 'A&E' },
                  { name: 'Connolly Hospital', location: 'Blanchardstown', type: 'A&E' },
                ].map((hospital, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Hospital className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-slate-900">{hospital.name}</p>
                      <p className="text-xs text-slate-500">{hospital.location} • {hospital.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
            <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              🏥 {language === 'pt' ? 'Dicas de Saúde para Estudantes' : 'Health Tips for Students'}
            </h4>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-red-500 mt-0.5" />
                {language === 'pt' 
                  ? 'Tenha sempre um seguro saúde válido - é obrigatório para estudantes!'
                  : 'Always have valid health insurance - it\'s mandatory for students!'}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-red-500 mt-0.5" />
                {language === 'pt' 
                  ? 'Registre-se em um GP próximo de casa assim que chegar.'
                  : 'Register with a GP near your home as soon as you arrive.'}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-red-500 mt-0.5" />
                {language === 'pt' 
                  ? 'Para pequenos problemas, farmacêuticos podem ajudar sem precisar de médico.'
                  : 'For minor issues, pharmacists can help without needing a doctor.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Chip/Internet Section */}
        <div className="mb-12" data-testid="chip-section">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-100 rounded-xl">
              <Wifi className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-900">
                {language === 'pt' ? 'Chip e Internet' : 'SIM Card & Internet'}
              </h2>
              <p className="text-slate-500 text-sm">
                {language === 'pt' ? 'Operadoras e planos para estudantes' : 'Carriers and plans for students'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Three */}
            <Card className="border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-pink-500 to-red-500" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Three</h3>
                  <Badge className="bg-pink-100 text-pink-700">{language === 'pt' ? 'Mais Popular' : 'Most Popular'}</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  {language === 'pt' 
                    ? 'Maior operadora da Irlanda. Melhor cobertura e planos pré-pagos populares entre estudantes.'
                    : 'Ireland\'s largest carrier. Best coverage and popular prepaid plans among students.'}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">{language === 'pt' ? 'Plano 28 dias' : '28-day Plan'}</span>
                    <span className="font-bold text-pink-600">€20</span>
                  </div>
                  <p className="text-xs text-slate-500">{language === 'pt' ? 'Dados ilimitados + ligações ilimitadas' : 'Unlimited data + unlimited calls'}</p>
                </div>
                <a href="https://www.three.ie" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors">
                  {language === 'pt' ? 'Ver Planos' : 'View Plans'}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            {/* Vodafone */}
            <Card className="border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-red-500 to-red-600" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Vodafone</h3>
                  <Badge variant="secondary">{language === 'pt' ? 'Boa Cobertura' : 'Good Coverage'}</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  {language === 'pt' 
                    ? 'Segunda maior operadora. Boa cobertura em áreas rurais e planos flexíveis.'
                    : 'Second largest carrier. Good coverage in rural areas and flexible plans.'}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">{language === 'pt' ? 'Plano 28 dias' : '28-day Plan'}</span>
                    <span className="font-bold text-red-600">€20</span>
                  </div>
                  <p className="text-xs text-slate-500">{language === 'pt' ? 'Dados ilimitados + extras' : 'Unlimited data + extras'}</p>
                </div>
                <a href="https://www.vodafone.ie" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  {language === 'pt' ? 'Ver Planos' : 'View Plans'}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            {/* Eir */}
            <Card className="border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Eir</h3>
                  <Badge variant="secondary">{language === 'pt' ? 'Irlandês' : 'Irish'}</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  {language === 'pt' 
                    ? 'Operadora irlandesa tradicional. Oferece combos com internet fixa para quem mora em apartamento.'
                    : 'Traditional Irish carrier. Offers combos with home internet for apartment dwellers.'}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">{language === 'pt' ? 'Plano 28 dias' : '28-day Plan'}</span>
                    <span className="font-bold text-cyan-600">€14.99</span>
                  </div>
                  <p className="text-xs text-slate-500">{language === 'pt' ? 'Dados ilimitados' : 'Unlimited data'}</p>
                </div>
                <a href="https://www.eir.ie" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors">
                  {language === 'pt' ? 'Ver Planos' : 'View Plans'}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Chip Tips */}
          <div className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200">
            <h4 className="font-semibold text-cyan-900 mb-3 flex items-center gap-2">
              📱 {language === 'pt' ? 'Dicas sobre Chip' : 'SIM Card Tips'}
            </h4>
            <ul className="space-y-2 text-sm text-cyan-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-cyan-500 mt-0.5" />
                {language === 'pt' 
                  ? 'Compre o chip assim que chegar no aeroporto - tem lojas da Three e Vodafone lá!'
                  : 'Buy your SIM card as soon as you arrive at the airport - Three and Vodafone have stores there!'}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-cyan-500 mt-0.5" />
                {language === 'pt' 
                  ? 'Three é a mais popular entre estudantes brasileiros pelo preço e cobertura.'
                  : 'Three is the most popular among Brazilian students for price and coverage.'}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-cyan-500 mt-0.5" />
                {language === 'pt' 
                  ? 'WiFi gratuito está disponível em bibliotecas, cafés e no transporte público!'
                  : 'Free WiFi is available in libraries, cafes and on public transport!'}
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-6">
            {t('services_agencies')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agencies.map((agency) => (
              <Card 
                key={agency.id} 
                className="border-slate-100 hover:shadow-lg transition-shadow"
                data-testid={`agency-${agency.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl flex-shrink-0">
                      <Building2 className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {language === 'pt' ? agency.name : agency.name_en}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4">
                        {language === 'pt' ? agency.description : agency.description_en}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {agency.address}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {agency.phone}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="h-4 w-4 text-slate-400" />
                          {agency.opening_hours}
                        </div>
                      </div>

                      {agency.services && agency.services.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <div className="flex flex-wrap gap-1">
                            {agency.services.map((service, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <a 
                        href={agency.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-4 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                      >
                        <Globe className="h-4 w-4" />
                        {language === 'pt' ? 'Visitar site' : 'Visit website'}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
