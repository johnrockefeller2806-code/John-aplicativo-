import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  CheckSquare,
  Briefcase,
  ShoppingCart,
  Flag,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
  Globe,
  CheckCircle,
  Circle,
  Star,
  FileText,
  Users,
  Euro,
  Package,
  Utensils,
  Scissors,
  Stethoscope,
  Truck,
  AlertCircle,
  Lightbulb,
  Calendar,
  Building2,
  Heart
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const StudentGuide = () => {
  const { language } = useLanguage();
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Checklist data
  const checklistData = {
    week1: {
      title: language === 'pt' ? 'Semana 1 - Chegada' : 'Week 1 - Arrival',
      items: [
        { id: 'w1_1', text: language === 'pt' ? 'Ativar chip de celular irlandês' : 'Activate Irish SIM card', priority: 'high' },
        { id: 'w1_2', text: language === 'pt' ? 'Abrir conta no Revolut (só precisa do passaporte)' : 'Open Revolut account (only need passport)', priority: 'high' },
        { id: 'w1_3', text: language === 'pt' ? 'Conhecer a vizinhança e supermercados próximos' : 'Explore neighborhood and nearby supermarkets', priority: 'medium' },
        { id: 'w1_4', text: language === 'pt' ? 'Comprar Leap Card para transporte' : 'Buy Leap Card for transport', priority: 'high' },
        { id: 'w1_5', text: language === 'pt' ? 'Ir à escola e confirmar matrícula' : 'Go to school and confirm enrollment', priority: 'high' },
      ]
    },
    week2: {
      title: language === 'pt' ? 'Semana 2 - Documentação' : 'Week 2 - Documentation',
      items: [
        { id: 'w2_1', text: language === 'pt' ? 'Solicitar PPS Number online' : 'Apply for PPS Number online', priority: 'high' },
        { id: 'w2_2', text: language === 'pt' ? 'Abrir conta em banco tradicional (AIB ou BOI)' : 'Open traditional bank account (AIB or BOI)', priority: 'medium' },
        { id: 'w2_3', text: language === 'pt' ? 'Começar a procurar emprego' : 'Start looking for a job', priority: 'medium' },
        { id: 'w2_4', text: language === 'pt' ? 'Fazer seguro de saúde (se ainda não tiver)' : 'Get health insurance (if not already)', priority: 'high' },
      ]
    },
    week3: {
      title: language === 'pt' ? 'Semana 3-4 - Estabelecimento' : 'Week 3-4 - Settlement',
      items: [
        { id: 'w3_1', text: language === 'pt' ? 'Agendar GNIB/IRP (até 90 dias após chegada)' : 'Schedule GNIB/IRP (within 90 days of arrival)', priority: 'high' },
        { id: 'w3_2', text: language === 'pt' ? 'Receber PPS Number e ativar' : 'Receive PPS Number and activate', priority: 'high' },
        { id: 'w3_3', text: language === 'pt' ? 'Criar perfil no LinkedIn e Indeed.ie' : 'Create profile on LinkedIn and Indeed.ie', priority: 'medium' },
        { id: 'w3_4', text: language === 'pt' ? 'Conhecer a comunidade brasileira' : 'Meet the Brazilian community', priority: 'low' },
        { id: 'w3_5', text: language === 'pt' ? 'Explorar Dublin nos fins de semana' : 'Explore Dublin on weekends', priority: 'low' },
      ]
    },
    month2: {
      title: language === 'pt' ? 'Mês 2+ - Rotina' : 'Month 2+ - Routine',
      items: [
        { id: 'm2_1', text: language === 'pt' ? 'Comparecer ao GNIB/IRP com documentos' : 'Attend GNIB/IRP with documents', priority: 'high' },
        { id: 'm2_2', text: language === 'pt' ? 'Manter frequência de 85%+ na escola' : 'Maintain 85%+ school attendance', priority: 'high' },
        { id: 'm2_3', text: language === 'pt' ? 'Organizar finanças e economizar' : 'Organize finances and save', priority: 'medium' },
        { id: 'm2_4', text: language === 'pt' ? 'Renovar documentos quando necessário' : 'Renew documents when needed', priority: 'medium' },
      ]
    }
  };

  // Employment data
  const employmentData = {
    jobSites: [
      { name: 'Indeed.ie', url: 'https://ie.indeed.com', desc: language === 'pt' ? 'Maior site de empregos da Irlanda' : 'Largest job site in Ireland' },
      { name: 'Jobs.ie', url: 'https://www.jobs.ie', desc: language === 'pt' ? 'Empregos em várias áreas' : 'Jobs in various areas' },
      { name: 'IrishJobs.ie', url: 'https://www.irishjobs.ie', desc: language === 'pt' ? 'Foco em profissionais qualificados' : 'Focus on qualified professionals' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs', desc: language === 'pt' ? 'Networking e vagas profissionais' : 'Networking and professional jobs' },
      { name: 'Gumtree Ireland', url: 'https://www.gumtree.ie', desc: language === 'pt' ? 'Vagas informais e part-time' : 'Informal and part-time jobs' },
    ],
    rights: [
      { title: language === 'pt' ? 'Salário Mínimo' : 'Minimum Wage', value: '€12.70/hora', desc: language === 'pt' ? 'Desde janeiro 2024' : 'Since January 2024' },
      { title: language === 'pt' ? 'Horas de Trabalho' : 'Working Hours', value: '20h/semana', desc: language === 'pt' ? 'Durante período de aulas (40h nas férias)' : 'During school term (40h on holidays)' },
      { title: language === 'pt' ? 'Férias Pagas' : 'Paid Leave', value: '4 semanas/ano', desc: language === 'pt' ? 'Proporcional ao tempo trabalhado' : 'Proportional to time worked' },
      { title: language === 'pt' ? 'Descanso' : 'Rest Breaks', value: '15-30 min', desc: language === 'pt' ? '15min a cada 4h30, 30min a cada 6h' : '15min every 4h30, 30min every 6h' },
    ],
    cvTips: [
      language === 'pt' ? 'CV irlandês tem no máximo 2 páginas' : 'Irish CV has maximum 2 pages',
      language === 'pt' ? 'Não inclua foto, idade ou estado civil' : 'Do not include photo, age or marital status',
      language === 'pt' ? 'Destaque experiências relevantes primeiro' : 'Highlight relevant experiences first',
      language === 'pt' ? 'Use verbos de ação (managed, developed, achieved)' : 'Use action verbs (managed, developed, achieved)',
      language === 'pt' ? 'Inclua referências ou "Available upon request"' : 'Include references or "Available upon request"',
      language === 'pt' ? 'Adapte o CV para cada vaga' : 'Customize CV for each job',
    ],
    commonJobs: [
      { title: language === 'pt' ? 'Hospitalidade' : 'Hospitality', examples: 'Barista, Garçom, Kitchen Porter', icon: Utensils },
      { title: language === 'pt' ? 'Varejo' : 'Retail', examples: 'Vendedor, Caixa, Estoquista', icon: ShoppingCart },
      { title: language === 'pt' ? 'Limpeza' : 'Cleaning', examples: 'Cleaner, Housekeeping', icon: Building2 },
      { title: language === 'pt' ? 'Delivery' : 'Delivery', examples: 'Deliveroo, Just Eat, Uber Eats', icon: Truck },
    ]
  };

  // Supermarkets data
  const supermarkets = [
    {
      name: 'Lidl',
      type: language === 'pt' ? 'Econômico' : 'Budget',
      color: 'bg-blue-600',
      desc: language === 'pt' 
        ? 'Supermercado alemão com preços baixos. Ótimo para compras semanais. Produtos de marca própria de qualidade.'
        : 'German supermarket with low prices. Great for weekly shopping. Quality own-brand products.',
      priceLevel: '€',
      tips: language === 'pt' 
        ? ['Ofertas especiais toda quinta-feira', 'Padaria fresca e barata', 'Frutas e vegetais baratos']
        : ['Special offers every Thursday', 'Fresh and cheap bakery', 'Cheap fruits and vegetables'],
      website: 'https://www.lidl.ie',
      storeFinder: 'https://www.lidl.ie/store-finder',
      locations: {
        'City Centre': ['Parnell Street', 'Aungier Street', 'North Circular Road'],
        'Dublin Sul': ['Rathmines', 'Ballsbridge', 'Nutgrove (Rathfarnham)'],
        'Dublin Norte': ['Drumcondra', 'Finglas', 'Artane']
      }
    },
    {
      name: 'Aldi',
      type: language === 'pt' ? 'Econômico' : 'Budget',
      color: 'bg-orange-500',
      desc: language === 'pt'
        ? 'Concorrente direto do Lidl, também alemão. Preços similares, ótima qualidade. Super Savers toda semana.'
        : 'Direct competitor to Lidl, also German. Similar prices, great quality. Super Savers every week.',
      priceLevel: '€',
      tips: language === 'pt'
        ? ['Super Savers às quartas e domingos', 'Produtos irlandeses de qualidade', 'Vinhos premiados baratos']
        : ['Super Savers on Wednesdays and Sundays', 'Quality Irish products', 'Cheap award-winning wines'],
      website: 'https://www.aldi.ie',
      storeFinder: 'https://www.aldi.ie/store-finder',
      locations: {
        'City Centre': ['Thomas Street', 'Cork Street', 'Dorset Street'],
        'Dublin Sul': ['Rathmines', 'Crumlin', 'Sundrive Road'],
        'Dublin Norte': ['Phibsborough', 'Glasnevin', 'Coolock']
      }
    },
    {
      name: 'Tesco',
      type: language === 'pt' ? 'Variedade' : 'Variety',
      color: 'bg-red-600',
      desc: language === 'pt'
        ? 'Maior rede de supermercados. Várias opções de tamanho (Express, Metro, Extra). Clubcard dá descontos.'
        : 'Largest supermarket chain. Various size options (Express, Metro, Extra). Clubcard gives discounts.',
      priceLevel: '€€',
      tips: language === 'pt'
        ? ['Faça o Clubcard para descontos', 'Tesco Express para compras rápidas', 'Delivery disponível']
        : ['Get Clubcard for discounts', 'Tesco Express for quick shopping', 'Delivery available'],
      website: 'https://www.tesco.ie',
      storeFinder: 'https://www.tesco.ie/store-locator',
      locations: {
        'City Centre': ['Jervis Centre (Metro)', 'Baggot Street (Express)', 'Parnell Street (Express)'],
        'Dublin Sul': ['Dundrum (Extra)', 'Ranelagh (Metro)', 'Rathmines (Metro)'],
        'Dublin Norte': ['Clearwater (Extra)', 'Drumcondra (Express)', 'Santry (Extra)']
      }
    },
    {
      name: 'Dunnes Stores',
      type: language === 'pt' ? 'Irlandês' : 'Irish',
      color: 'bg-green-700',
      desc: language === 'pt'
        ? 'Rede irlandesa com supermercado e roupas. Produtos Simply Better de alta qualidade. Boas promoções.'
        : 'Irish chain with supermarket and clothing. High quality Simply Better products. Good promotions.',
      priceLevel: '€€',
      tips: language === 'pt'
        ? ['Simply Better = produtos premium', 'Também vende roupas e casa', 'Shop & Save vouchers']
        : ['Simply Better = premium products', 'Also sells clothes and home', 'Shop & Save vouchers'],
      website: 'https://www.dunnesstores.com',
      storeFinder: 'https://www.dunnesstores.com/store-finder',
      locations: {
        'City Centre': ['St. Stephen\'s Green Centre', 'Henry Street (Ilac)', 'George\'s Street'],
        'Dublin Sul': ['Dundrum Town Centre', 'Cornelscourt', 'Nutgrove'],
        'Dublin Norte': ['Northside Shopping Centre', 'Omni Park Santry', 'Blanchardstown']
      }
    },
  ];

  const [selectedSupermarketRegion, setSelectedSupermarketRegion] = useState('City Centre');
  const supermarketRegions = ['City Centre', 'Dublin Sul', 'Dublin Norte'];

  // Brazilian services data
  const brazilianData = {
    restaurants: [
      { name: 'Picanha Brazilian Steakhouse', location: 'Ranelagh', type: language === 'pt' ? 'Churrascaria' : 'Steakhouse', phone: '+353 1 497 7377' },
      { name: 'Brasil Dublin', location: 'Parnell Street', type: language === 'pt' ? 'Restaurante' : 'Restaurant', phone: '+353 1 873 4949' },
      { name: 'Fogo Grill', location: 'Temple Bar', type: language === 'pt' ? 'Churrasco' : 'BBQ', phone: '+353 1 671 8829' },
      { name: 'Rio Brazilian Restaurant', location: 'Dame Street', type: language === 'pt' ? 'Buffet' : 'Buffet', phone: '+353 1 671 1234' },
    ],
    stores: [
      { name: 'Brasil Store Dublin', location: 'Parnell Street', desc: language === 'pt' ? 'Produtos brasileiros, feijão, farofa, guaraná' : 'Brazilian products, beans, farofa, guaraná' },
      { name: 'Tropical Foods', location: 'Moore Street', desc: language === 'pt' ? 'Ingredientes brasileiros e latinos' : 'Brazilian and Latin ingredients' },
      { name: 'Asian & Brazilian Market', location: 'Capel Street', desc: language === 'pt' ? 'Variedade de produtos importados' : 'Variety of imported products' },
    ],
    services: [
      { name: language === 'pt' ? 'Cabeleireiros Brasileiros' : 'Brazilian Hairdressers', icon: Scissors, examples: 'Studio Hair Brasil, Brazilian Beauty' },
      { name: language === 'pt' ? 'Dentistas que falam Português' : 'Portuguese-speaking Dentists', icon: Stethoscope, examples: 'Dublin Dental (Dr. Silva), Smile Clinic' },
      { name: language === 'pt' ? 'Despachantes/Consultores' : 'Immigration Consultants', icon: FileText, examples: 'Brasil na Irlanda, Dublin Immigration' },
    ],
    shipping: [
      { name: 'PostBrazil', url: 'https://www.postbrazil.ie', desc: language === 'pt' ? 'Envio de encomendas Brasil-Irlanda' : 'Shipping Brazil-Ireland', time: '7-15 dias' },
      { name: 'TransExpress', url: 'https://www.transexpress.ie', desc: language === 'pt' ? 'Caixas e documentos para o Brasil' : 'Boxes and documents to Brazil', time: '10-20 dias' },
      { name: 'Correios (EMS)', url: 'https://www.anpost.com', desc: language === 'pt' ? 'Via An Post, mais econômico' : 'Via An Post, more economical', time: '15-30 dias' },
    ]
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getPriorityLabel = (priority) => {
    if (language === 'pt') {
      switch (priority) {
        case 'high': return 'Urgente';
        case 'medium': return 'Importante';
        case 'low': return 'Opcional';
        default: return '';
      }
    } else {
      switch (priority) {
        case 'high': return 'Urgent';
        case 'medium': return 'Important';
        case 'low': return 'Optional';
        default: return '';
      }
    }
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = Object.values(checklistData).reduce((acc, week) => acc + week.items.length, 0);
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-slate-50" data-testid="student-guide-page">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Star className="h-8 w-8" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  {language === 'pt' ? 'Guia Completo' : 'Complete Guide'}
                </Badge>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="guide-title">
                {language === 'pt' ? 'Guia do Estudante' : 'Student Guide'}
              </h1>
              <p className="text-emerald-100 text-lg max-w-2xl">
                {language === 'pt' 
                  ? 'Tudo que você precisa saber para começar sua vida na Irlanda com o pé direito!'
                  : 'Everything you need to know to start your life in Ireland on the right foot!'}
              </p>
            </div>
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-20 md:h-24 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-2xl p-3 hidden sm:block"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
        {/* Tabs */}
        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="bg-orange-500 border-none p-2 flex-wrap h-auto rounded-xl shadow-md">
            <TabsTrigger value="checklist" className="gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md rounded-lg" data-testid="tab-checklist">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'pt' ? 'Checklist' : 'Checklist'}</span>
              <span className="sm:hidden">✓</span>
            </TabsTrigger>
            <TabsTrigger value="emprego" className="gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md rounded-lg" data-testid="tab-emprego">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'pt' ? 'Emprego' : 'Employment'}</span>
              <span className="sm:hidden">💼</span>
            </TabsTrigger>
            <TabsTrigger value="supermercados" className="gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md rounded-lg" data-testid="tab-supermercados">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'pt' ? 'Supermercados' : 'Supermarkets'}</span>
              <span className="sm:hidden">🛒</span>
            </TabsTrigger>
            <TabsTrigger value="brasil" className="gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md rounded-lg" data-testid="tab-brasil">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'pt' ? 'Brasil na Irlanda' : 'Brazil in Ireland'}</span>
              <span className="sm:hidden">🇧🇷</span>
            </TabsTrigger>
          </TabsList>

          {/* CHECKLIST TAB */}
          <TabsContent value="checklist" data-testid="checklist-content">
            {/* Progress Bar */}
            <Card className="border-slate-100 mb-6 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">
                      {language === 'pt' ? 'Seu Progresso' : 'Your Progress'}
                    </h3>
                  </div>
                  <Badge className={progressPercent === 100 ? 'bg-emerald-600' : 'bg-slate-600'}>
                    {completedCount}/{totalCount} {language === 'pt' ? 'completos' : 'completed'}
                  </Badge>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">
                  {progressPercent === 100 
                    ? (language === 'pt' ? '🎉 Parabéns! Você completou todos os itens!' : '🎉 Congratulations! You completed all items!')
                    : (language === 'pt' ? `${progressPercent}% concluído - Continue assim!` : `${progressPercent}% complete - Keep going!`)}
                </p>
              </CardContent>
            </Card>

            {/* Checklist Items */}
            <div className="space-y-6">
              {Object.entries(checklistData).map(([key, week]) => (
                <Card key={key} className="border-slate-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      {week.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {week.items.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                            checkedItems[item.id] 
                              ? 'bg-emerald-50 border border-emerald-200' 
                              : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
                          }`}
                        >
                          {checkedItems[item.id] ? (
                            <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Circle className="h-6 w-6 text-slate-300 flex-shrink-0" />
                          )}
                          <span className={`flex-1 ${checkedItems[item.id] ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                            {item.text}
                          </span>
                          <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                            {getPriorityLabel(item.priority)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* EMPREGO TAB */}
          <TabsContent value="emprego" data-testid="emprego-content">
            {/* Job Sites */}
            <Card className="border-slate-100 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Sites de Emprego' : 'Job Sites'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employmentData.jobSites.map((site, index) => (
                    <a
                      key={index}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all group"
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <Globe className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 group-hover:text-emerald-700">{site.name}</p>
                        <p className="text-xs text-slate-500">{site.desc}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workers Rights */}
            <Card className="border-slate-100 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Seus Direitos Trabalhistas' : 'Your Worker Rights'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {employmentData.rights.map((right, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-emerald-700 mb-1">{right.value}</p>
                      <p className="font-semibold text-slate-900">{right.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{right.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CV Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    {language === 'pt' ? 'Como Fazer um CV Irlandês' : 'How to Make an Irish CV'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {employmentData.cvTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-slate-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-emerald-600" />
                    {language === 'pt' ? 'Empregos Comuns para Estudantes' : 'Common Jobs for Students'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employmentData.commonJobs.map((job, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <job.icon className="h-5 w-5 text-emerald-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.examples}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tips Box */}
            <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                {language === 'pt' ? 'Dicas para Conseguir Emprego' : 'Tips to Get a Job'}
              </h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {language === 'pt'
                    ? 'Entregue CV pessoalmente em cafés, restaurantes e lojas - muitos contratam assim!'
                    : 'Deliver CV in person at cafes, restaurants and shops - many hire this way!'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {language === 'pt'
                    ? 'Faça um curso de Barista - aumenta muito suas chances em cafés'
                    : 'Take a Barista course - greatly increases your chances at cafes'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {language === 'pt'
                    ? 'Use o LinkedIn para networking e siga empresas que te interessam'
                    : 'Use LinkedIn for networking and follow companies that interest you'}
                </li>
              </ul>
            </div>
          </TabsContent>

          {/* SUPERMERCADOS TAB */}
          <TabsContent value="supermercados" data-testid="supermercados-content">
            {/* Region Filter */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">
                  {language === 'pt' ? 'Filtrar por região:' : 'Filter by region:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {supermarketRegions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedSupermarketRegion(region)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedSupermarketRegion === region
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {supermarkets.map((market, index) => (
                <Card key={index} className="border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`h-2 ${market.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-slate-900">{market.name}</h3>
                          <Badge variant="secondary">{market.type}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(market.priceLevel.length)].map((_, i) => (
                            <Euro key={i} className="h-4 w-4 text-emerald-600" />
                          ))}
                          {[...Array(3 - market.priceLevel.length)].map((_, i) => (
                            <Euro key={i} className="h-4 w-4 text-slate-200" />
                          ))}
                          <span className="text-xs text-slate-500 ml-1">
                            {market.priceLevel === '€' 
                              ? (language === 'pt' ? 'Mais barato' : 'Cheapest')
                              : (language === 'pt' ? 'Preço médio' : 'Mid-range')}
                          </span>
                        </div>
                      </div>
                      <a
                        href={market.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-100 rounded-lg hover:bg-emerald-100 transition-colors"
                        title={language === 'pt' ? 'Site oficial' : 'Official website'}
                      >
                        <Globe className="h-4 w-4 text-slate-600" />
                      </a>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4">{market.desc}</p>
                    
                    {/* Locations Section - Now with Google Maps links */}
                    {market.locations && market.locations[selectedSupermarketRegion] && (
                      <div className="bg-emerald-50 rounded-xl p-3 mb-4 border border-emerald-100">
                        <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {language === 'pt' ? `Lojas em ${selectedSupermarketRegion}` : `Stores in ${selectedSupermarketRegion}`}
                          <span className="text-emerald-500 ml-1">({language === 'pt' ? 'clique para ver no mapa' : 'click to view on map'})</span>
                        </p>
                        <ul className="space-y-2">
                          {market.locations[selectedSupermarketRegion].map((location, i) => (
                            <li key={i}>
                              <a
                                href={`https://www.google.com/maps/search/${encodeURIComponent(market.name + ' ' + location + ' Dublin Ireland')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-emerald-100 transition-colors group"
                              >
                                <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                  <MapPin className="h-4 w-4 text-red-600" />
                                </div>
                                <span className="text-sm text-emerald-800 group-hover:text-emerald-900 font-medium flex-1">
                                  {location}
                                </span>
                                <ExternalLink className="h-3 w-3 text-emerald-400 group-hover:text-emerald-600" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                        💡 {language === 'pt' ? 'Dicas' : 'Tips'}
                      </p>
                      <ul className="space-y-1">
                        {market.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-emerald-500 mt-1 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Google Maps Button - Search all stores */}
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(market.name + ' Dublin Ireland')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <MapPin className="h-4 w-4" />
                      {language === 'pt' ? `Ver todos ${market.name} no Google Maps` : `View all ${market.name} on Google Maps`}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Price Comparison */}
            <Card className="border-slate-100 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Comparativo de Preços (aproximado)' : 'Price Comparison (approximate)'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3 font-semibold text-slate-700">{language === 'pt' ? 'Produto' : 'Product'}</th>
                        <th className="text-center py-2 px-3 font-semibold text-blue-600">Lidl</th>
                        <th className="text-center py-2 px-3 font-semibold text-orange-500">Aldi</th>
                        <th className="text-center py-2 px-3 font-semibold text-red-600">Tesco</th>
                        <th className="text-center py-2 px-3 font-semibold text-green-700">Dunnes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { item: language === 'pt' ? 'Leite 1L' : 'Milk 1L', prices: ['€1.15', '€1.15', '€1.35', '€1.30'] },
                        { item: language === 'pt' ? 'Pão fatiado' : 'Sliced bread', prices: ['€0.89', '€0.89', '€1.20', '€1.10'] },
                        { item: language === 'pt' ? 'Frango 1kg' : 'Chicken 1kg', prices: ['€5.99', '€5.99', '€7.50', '€7.00'] },
                        { item: language === 'pt' ? 'Arroz 1kg' : 'Rice 1kg', prices: ['€1.49', '€1.49', '€1.89', '€1.79'] },
                        { item: language === 'pt' ? 'Ovos (12)' : 'Eggs (12)', prices: ['€2.49', '€2.49', '€3.20', '€3.00'] },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-2 px-3 font-medium text-slate-700">{row.item}</td>
                          {row.prices.map((price, j) => (
                            <td key={j} className={`text-center py-2 px-3 ${j < 2 ? 'text-emerald-600 font-semibold' : 'text-slate-600'}`}>
                              {price}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Savings Tips */}
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                💰 {language === 'pt' ? 'Dicas para Economizar' : 'Tips to Save Money'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {language === 'pt' ? 'Compre em Lidl ou Aldi para o dia a dia' : 'Shop at Lidl or Aldi for daily needs'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {language === 'pt' ? 'Fique de olho nas ofertas da semana' : 'Keep an eye on weekly offers'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {language === 'pt' ? 'Produtos perto da validade têm desconto' : 'Products near expiry have discounts'}
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {language === 'pt' ? 'Use apps como Too Good To Go' : 'Use apps like Too Good To Go'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {language === 'pt' ? 'Faça lista de compras para evitar compras por impulso' : 'Make shopping lists to avoid impulse buying'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {language === 'pt' ? 'Cozinhe em casa - muito mais barato!' : 'Cook at home - much cheaper!'}
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* BRASIL NA IRLANDA TAB */}
          <TabsContent value="brasil" data-testid="brasil-content">
            {/* Restaurants */}
            <Card className="border-slate-100 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Restaurantes Brasileiros' : 'Brazilian Restaurants'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brazilianData.restaurants.map((restaurant, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <span className="text-2xl">🇧🇷</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{restaurant.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="h-3 w-3" />
                          {restaurant.location}
                          <span className="text-slate-300">|</span>
                          {restaurant.type}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-emerald-600 mt-1">
                          <Phone className="h-3 w-3" />
                          {restaurant.phone}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Brazilian Stores */}
            <Card className="border-slate-100 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Lojas de Produtos Brasileiros' : 'Brazilian Product Stores'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {brazilianData.stores.map((store, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl border border-green-100">
                      <h4 className="font-semibold text-slate-900 mb-1">{store.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                        <MapPin className="h-3 w-3" />
                        {store.location}
                      </div>
                      <p className="text-xs text-slate-600">{store.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Brazilian Services */}
            <Card className="border-slate-100 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Serviços em Português' : 'Portuguese-speaking Services'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {brazilianData.services.map((service, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <service.icon className="h-5 w-5 text-emerald-700" />
                        </div>
                        <h4 className="font-semibold text-slate-900">{service.name}</h4>
                      </div>
                      <p className="text-sm text-slate-500">{service.examples}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card className="border-slate-100 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  {language === 'pt' ? 'Envio de Encomendas Brasil ↔ Irlanda' : 'Shipping Brazil ↔ Ireland'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {brazilianData.shipping.map((shipping, index) => (
                    <a
                      key={index}
                      href={shipping.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 group-hover:text-emerald-700">{shipping.name}</h4>
                        <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{shipping.desc}</p>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {shipping.time}
                      </Badge>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Tips */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                🇧🇷 {language === 'pt' ? 'Comunidade Brasileira' : 'Brazilian Community'}
              </h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <Heart className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {language === 'pt'
                    ? 'Procure grupos no Facebook como "Brasileiros em Dublin", "Brasileiros na Irlanda"'
                    : 'Look for Facebook groups like "Brasileiros em Dublin", "Brasileiros na Irlanda"'}
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {language === 'pt'
                    ? 'Participe de eventos da comunidade - churrascos, festas juninas, carnaval'
                    : 'Join community events - BBQs, June parties, carnival'}
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {language === 'pt'
                    ? 'A comunidade brasileira é muito unida e ajuda muito quem está chegando!'
                    : 'The Brazilian community is very united and helps newcomers a lot!'}
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
