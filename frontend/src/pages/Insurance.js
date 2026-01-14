import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Shield,
  Search,
  ExternalLink,
  Globe,
  CheckCircle,
  Lightbulb,
  Star,
  Heart,
  Phone,
  Clock,
  Euro,
  AlertTriangle,
  FileText,
  Stethoscope,
  Plane,
  Users,
  Award
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const Insurance = () => {
  const { language } = useLanguage();

  // Comparison sites
  const comparisonSites = [
    {
      name: 'Seguros Promo',
      logo: '🔍',
      color: 'from-purple-500 to-indigo-600',
      description: language === 'pt'
        ? 'O maior comparador de seguros do Brasil. Compare preços de várias seguradoras em segundos e ganhe desconto exclusivo.'
        : 'Brazil\'s largest insurance comparator. Compare prices from various insurers in seconds and get exclusive discount.',
      features: language === 'pt'
        ? ['Compara +10 seguradoras', 'Desconto de 15% no site', 'Pagamento em Real', 'Atendimento em português']
        : ['Compares +10 insurers', '15% discount on site', 'Payment in BRL', 'Portuguese support'],
      url: 'https://www.segurospromo.com.br',
      discount: '15% OFF',
      recommended: true
    },
    {
      name: 'Real Seguro Viagem',
      logo: '🛡️',
      color: 'from-emerald-500 to-teal-600',
      description: language === 'pt'
        ? 'Comparador brasileiro confiável. Mostra todas as coberturas detalhadas e ajuda a escolher o melhor plano para seu perfil.'
        : 'Reliable Brazilian comparator. Shows all detailed coverage and helps choose the best plan for your profile.',
      features: language === 'pt'
        ? ['Comparação detalhada', 'Filtro por cobertura', 'Chat de suporte', 'Parcelamento em até 12x']
        : ['Detailed comparison', 'Coverage filter', 'Support chat', 'Up to 12 installments'],
      url: 'https://www.realseguroviagem.com.br',
      discount: '10% OFF',
      recommended: true
    }
  ];

  // Insurance companies
  const insuranceCompanies = [
    {
      name: 'World Nomads',
      logo: '🌍',
      color: 'from-blue-500 to-cyan-500',
      type: language === 'pt' ? 'Internacional' : 'International',
      description: language === 'pt'
        ? 'Uma das mais populares para estudantes e viajantes de longa duração. Cobre mais de 200 atividades e esportes.'
        : 'One of the most popular for students and long-term travelers. Covers over 200 activities and sports.',
      coverage: language === 'pt'
        ? ['Despesas médicas até €2.500.000', 'Cancelamento de viagem', 'Bagagem extraviada', 'Esportes de aventura']
        : ['Medical expenses up to €2,500,000', 'Trip cancellation', 'Lost baggage', 'Adventure sports'],
      pros: language === 'pt'
        ? ['Pode comprar já viajando', 'Cobre muitas atividades', 'App fácil de usar', 'Renovação online']
        : ['Can buy while traveling', 'Covers many activities', 'Easy to use app', 'Online renewal'],
      priceRange: '€2-5/dia',
      url: 'https://www.worldnomads.com',
      bestFor: language === 'pt' ? 'Estudantes aventureiros' : 'Adventurous students'
    },
    {
      name: 'SafetyWing',
      logo: '🦋',
      color: 'from-teal-500 to-green-500',
      type: language === 'pt' ? 'Nômades Digitais' : 'Digital Nomads',
      description: language === 'pt'
        ? 'Perfeito para estadias longas. Funciona como uma assinatura mensal - pague enquanto precisar, cancele quando quiser.'
        : 'Perfect for long stays. Works like a monthly subscription - pay while you need it, cancel when you want.',
      coverage: language === 'pt'
        ? ['Despesas médicas até €250.000', 'COVID-19 incluído', 'Viagens de volta ao Brasil', 'Emergências 24/7']
        : ['Medical expenses up to €250,000', 'COVID-19 included', 'Return trips to Brazil', '24/7 emergencies'],
      pros: language === 'pt'
        ? ['Assinatura mensal', 'Preço fixo baixo', 'Sem exames médicos', 'Ideal para intercâmbio']
        : ['Monthly subscription', 'Low fixed price', 'No medical exams', 'Ideal for exchange'],
      priceRange: '€42/mês',
      url: 'https://www.safetywing.com',
      bestFor: language === 'pt' ? 'Intercâmbio longo' : 'Long exchange programs'
    },
    {
      name: 'Allianz Travel',
      logo: '🏛️',
      color: 'from-blue-600 to-blue-800',
      type: language === 'pt' ? 'Tradicional' : 'Traditional',
      description: language === 'pt'
        ? 'Uma das maiores seguradoras do mundo. Confiança e segurança com coberturas completas e atendimento 24h.'
        : 'One of the world\'s largest insurers. Trust and security with comprehensive coverage and 24h service.',
      coverage: language === 'pt'
        ? ['Despesas médicas até €1.000.000', 'Repatriação', 'Assistência jurídica', 'Cancelamento de viagem']
        : ['Medical expenses up to €1,000,000', 'Repatriation', 'Legal assistance', 'Trip cancellation'],
      pros: language === 'pt'
        ? ['Marca reconhecida', 'Rede mundial', 'Atendimento em português', 'App completo']
        : ['Recognized brand', 'Worldwide network', 'Portuguese support', 'Complete app'],
      priceRange: '€3-8/dia',
      url: 'https://www.allianz-travel.com.br',
      bestFor: language === 'pt' ? 'Quem quer segurança' : 'Those who want security'
    },
    {
      name: 'GTA - Global Travel Assistance',
      logo: '🌐',
      color: 'from-red-500 to-orange-500',
      type: language === 'pt' ? 'Brasileira' : 'Brazilian',
      description: language === 'pt'
        ? 'Seguradora brasileira com muita experiência. Atendimento em português 24h e planos específicos para estudantes.'
        : 'Brazilian insurer with lots of experience. 24h Portuguese service and specific plans for students.',
      coverage: language === 'pt'
        ? ['Despesas médicas até €300.000', 'Odontológico', 'Bagagem', 'Assistência 24h em português']
        : ['Medical expenses up to €300,000', 'Dental', 'Baggage', '24h Portuguese assistance'],
      pros: language === 'pt'
        ? ['100% em português', 'Pagamento em Real', 'Parcela em até 12x', 'Planos para estudantes']
        : ['100% in Portuguese', 'Payment in BRL', 'Up to 12 installments', 'Student plans'],
      priceRange: '€2-6/dia',
      url: 'https://www.gta-seguroviagem.com.br',
      bestFor: language === 'pt' ? 'Atendimento em português' : 'Portuguese support'
    },
    {
      name: 'Assist Card',
      logo: '💳',
      color: 'from-indigo-500 to-purple-600',
      type: language === 'pt' ? 'América Latina' : 'Latin America',
      description: language === 'pt'
        ? 'Líder na América Latina em assistência ao viajante. Mais de 50 anos de experiência e rede própria de prestadores.'
        : 'Leader in Latin America for traveler assistance. Over 50 years of experience and own provider network.',
      coverage: language === 'pt'
        ? ['Despesas médicas até €500.000', 'Telemedicina', 'Medicamentos', 'Emergências odontológicas']
        : ['Medical expenses up to €500,000', 'Telemedicine', 'Medications', 'Dental emergencies'],
      pros: language === 'pt'
        ? ['Rede própria', 'Telemedicina 24h', 'App com carteirinha', 'Muita experiência']
        : ['Own network', '24h telemedicine', 'App with card', 'Lots of experience'],
      priceRange: '€3-7/dia',
      url: 'https://www.assistcard.com/br',
      bestFor: language === 'pt' ? 'Rede de atendimento' : 'Service network'
    },
    {
      name: 'April International',
      logo: '🔵',
      color: 'from-cyan-600 to-blue-600',
      type: language === 'pt' ? 'Especialista em Expatriados' : 'Expat Specialist',
      description: language === 'pt'
        ? 'Especializada em seguros para quem vai morar no exterior. Planos de longa duração com cobertura completa.'
        : 'Specialized in insurance for those who will live abroad. Long-term plans with complete coverage.',
      coverage: language === 'pt'
        ? ['Despesas médicas ilimitadas', 'Maternidade', 'Check-ups', 'Doenças pré-existentes (após carência)']
        : ['Unlimited medical expenses', 'Maternity', 'Check-ups', 'Pre-existing conditions (after waiting period)'],
      pros: language === 'pt'
        ? ['Planos anuais', 'Cobertura completa', 'Ideal para morar fora', 'Renovação automática']
        : ['Annual plans', 'Complete coverage', 'Ideal for living abroad', 'Automatic renewal'],
      priceRange: '€80-150/mês',
      url: 'https://www.april-international.com',
      bestFor: language === 'pt' ? 'Morar na Irlanda' : 'Living in Ireland'
    }
  ];

  // What's required for Ireland
  const requirements = [
    {
      icon: Stethoscope,
      title: language === 'pt' ? 'Seguro Saúde Obrigatório' : 'Mandatory Health Insurance',
      desc: language === 'pt'
        ? 'Para o visto de estudante (Stamp 2), você PRECISA de seguro saúde válido por todo o período do curso.'
        : 'For the student visa (Stamp 2), you NEED valid health insurance for the entire course period.'
    },
    {
      icon: Euro,
      title: language === 'pt' ? 'Cobertura Mínima' : 'Minimum Coverage',
      desc: language === 'pt'
        ? 'Recomendado mínimo de €25.000 em despesas médicas. Quanto maior, melhor para sua segurança.'
        : 'Recommended minimum of €25,000 in medical expenses. The higher, the better for your safety.'
    },
    {
      icon: FileText,
      title: language === 'pt' ? 'Documento para GNIB' : 'Document for GNIB',
      desc: language === 'pt'
        ? 'Você precisará apresentar o comprovante do seguro na hora de fazer o GNIB/IRP.'
        : 'You will need to present proof of insurance when applying for GNIB/IRP.'
    },
    {
      icon: Clock,
      title: language === 'pt' ? 'Validade' : 'Validity',
      desc: language === 'pt'
        ? 'O seguro deve cobrir TODO o período que você ficará na Irlanda. Pode renovar se precisar estender.'
        : 'Insurance must cover the ENTIRE period you will be in Ireland. Can renew if you need to extend.'
    }
  ];

  // Tips
  const tips = [
    {
      title: language === 'pt' ? 'Compare sempre' : 'Always compare',
      desc: language === 'pt' 
        ? 'Use os comparadores (Seguros Promo, Real Seguro) para ver todas as opções e preços'
        : 'Use comparators (Seguros Promo, Real Seguro) to see all options and prices'
    },
    {
      title: language === 'pt' ? 'Leia a cobertura' : 'Read the coverage',
      desc: language === 'pt'
        ? 'Verifique o que está incluído: COVID, esportes, doenças pré-existentes'
        : 'Check what\'s included: COVID, sports, pre-existing conditions'
    },
    {
      title: language === 'pt' ? 'Atenção ao período' : 'Watch the period',
      desc: language === 'pt'
        ? 'Contrate para todo o período do intercâmbio. Se precisar, renove antes de vencer'
        : 'Contract for the entire exchange period. If needed, renew before it expires'
    },
    {
      title: language === 'pt' ? 'Guarde os documentos' : 'Keep documents',
      desc: language === 'pt'
        ? 'Salve a apólice no celular e email. Você vai precisar para o GNIB'
        : 'Save the policy on your phone and email. You will need it for GNIB'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="insurance-page">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 text-white py-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🛡️</div>
          <div className="absolute bottom-10 right-20 text-8xl">❤️</div>
          <div className="absolute top-1/2 right-1/4 text-6xl">✨</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Shield className="h-8 w-8" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  {language === 'pt' ? 'Obrigatório para Estudantes' : 'Required for Students'}
                </Badge>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="insurance-title">
                {language === 'pt' ? 'Seguro Viagem' : 'Travel Insurance'}
              </h1>
              <p className="text-purple-100 text-lg max-w-2xl">
                {language === 'pt' 
                  ? 'Proteja sua viagem e sua saúde! Compare as melhores seguradoras e encontre o plano ideal para seu intercâmbio na Irlanda.'
                  : 'Protect your trip and your health! Compare the best insurers and find the ideal plan for your exchange in Ireland.'}
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        
        {/* Alert - Required */}
        <div className="mb-10 p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-xl flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 mb-1">
                ⚠️ {language === 'pt' ? 'Atenção: Seguro é OBRIGATÓRIO!' : 'Attention: Insurance is MANDATORY!'}
              </h3>
              <p className="text-red-800 text-sm">
                {language === 'pt'
                  ? 'Para estudar na Irlanda com visto Stamp 2, você PRECISA apresentar comprovante de seguro saúde válido. Sem seguro, você NÃO consegue fazer o GNIB/IRP!'
                  : 'To study in Ireland with a Stamp 2 visa, you MUST present valid health insurance proof. Without insurance, you CANNOT do the GNIB/IRP!'}
              </p>
            </div>
          </div>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {requirements.map((req, index) => (
            <Card key={index} className="border-slate-100">
              <CardContent className="p-5">
                <div className="p-2 bg-purple-100 rounded-xl w-fit mb-3">
                  <req.icon className="h-5 w-5 text-purple-700" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{req.title}</h3>
                <p className="text-sm text-slate-600">{req.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Sites Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Search className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-900">
                {language === 'pt' ? 'Comparadores de Seguro' : 'Insurance Comparators'}
              </h2>
              <p className="text-slate-500 text-sm">
                {language === 'pt' ? 'Compare várias seguradoras de uma vez e economize' : 'Compare multiple insurers at once and save'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisonSites.map((site, index) => (
              <Card 
                key={index} 
                className="border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 ring-2 ring-purple-500 ring-offset-2"
              >
                <div className={`h-2 bg-gradient-to-r ${site.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{site.logo}</span>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{site.name}</h3>
                        <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                          <Star className="h-3 w-3 mr-1" />
                          {site.discount}
                        </Badge>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">
                      {language === 'pt' ? 'Recomendado' : 'Recommended'}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4">{site.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {site.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r ${site.color} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md hover:shadow-lg`}
                  >
                    <Search className="h-4 w-4" />
                    {language === 'pt' ? 'Comparar Seguros' : 'Compare Insurance'}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Insurance Companies Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Shield className="h-6 w-6 text-indigo-700" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-900">
                {language === 'pt' ? 'Seguradoras Recomendadas' : 'Recommended Insurers'}
              </h2>
              <p className="text-slate-500 text-sm">
                {language === 'pt' ? 'Compre direto no site da seguradora' : 'Buy directly from the insurer website'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insuranceCompanies.map((company, index) => (
              <Card key={index} className="border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${company.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{company.logo}</span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{company.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{company.type}</Badge>
                          <Badge className="bg-slate-100 text-slate-700 text-xs">{company.priceRange}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-3">{company.description}</p>
                  
                  <div className="bg-purple-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-purple-700 mb-1">
                      ⭐ {language === 'pt' ? 'Ideal para:' : 'Best for:'} {company.bestFor}
                    </p>
                  </div>

                  {/* Coverage */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                      🛡️ {language === 'pt' ? 'Coberturas' : 'Coverage'}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {company.coverage.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-slate-600">
                          <CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pros */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                      ✅ {language === 'pt' ? 'Vantagens' : 'Pros'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {company.pros.map((pro, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                          {pro}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r ${company.color} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md`}
                  >
                    <Globe className="h-4 w-4" />
                    {language === 'pt' ? 'Ver Planos' : 'View Plans'}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Lightbulb className="h-6 w-6 text-amber-700" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-slate-900">
              {language === 'pt' ? 'Dicas Importantes' : 'Important Tips'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tips.map((tip, index) => (
              <Card key={index} className="border-slate-100 bg-gradient-to-br from-amber-50 to-yellow-50">
                <CardContent className="p-5">
                  <div className="text-2xl mb-2">💡</div>
                  <h3 className="font-semibold text-amber-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-amber-800">{tip.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What to look for */}
        <Card className="border-slate-100 mb-12 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="p-8">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              {language === 'pt' ? 'O que verificar antes de contratar' : 'What to check before hiring'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Euro, title: language === 'pt' ? 'Cobertura Médica' : 'Medical Coverage', desc: language === 'pt' ? 'Mínimo €25.000 - ideal €100.000+' : 'Minimum €25,000 - ideal €100,000+' },
                { icon: Plane, title: language === 'pt' ? 'Repatriação' : 'Repatriation', desc: language === 'pt' ? 'Retorno ao Brasil em emergência' : 'Return to Brazil in emergency' },
                { icon: FileText, title: language === 'pt' ? 'Bagagem' : 'Baggage', desc: language === 'pt' ? 'Extravio e atraso de bagagem' : 'Lost and delayed baggage' },
                { icon: Phone, title: language === 'pt' ? 'Assistência 24h' : '24h Assistance', desc: language === 'pt' ? 'Atendimento a qualquer hora' : 'Service at any time' },
                { icon: Heart, title: language === 'pt' ? 'COVID-19' : 'COVID-19', desc: language === 'pt' ? 'Verifique se está incluído' : 'Check if included' },
                { icon: Stethoscope, title: language === 'pt' ? 'Pré-existentes' : 'Pre-existing', desc: language === 'pt' ? 'Condições pré-existentes' : 'Pre-existing conditions' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                    <item.icon className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-100">
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">
            {language === 'pt' ? 'Proteja sua viagem!' : 'Protect your trip!'}
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-6">
            {language === 'pt'
              ? 'Não viaje sem seguro! Compare os preços nos comparadores acima e contrate o melhor plano para seu intercâmbio.'
              : 'Don\'t travel without insurance! Compare prices on the comparators above and get the best plan for your exchange.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://www.segurospromo.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Search className="h-5 w-5" />
              Seguros Promo (15% OFF)
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://www.realseguroviagem.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
            >
              <Shield className="h-5 w-5" />
              Real Seguro Viagem
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
