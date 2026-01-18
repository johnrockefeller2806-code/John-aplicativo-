import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plane,
  Search,
  ExternalLink,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Euro,
  CheckCircle,
  Lightbulb,
  TrendingDown,
  Star,
  ArrowRight,
  Compass
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const Flights = () => {
  const { language } = useLanguage();

  // Flight search engines
  const searchEngines = [
    {
      name: 'Google Flights',
      logo: '🔍',
      color: 'from-blue-500 to-blue-600',
      description: language === 'pt'
        ? 'O buscador mais completo do Google. Fácil de usar, mostra gráfico de preços e alertas de promoção.'
        : 'Google\'s most complete search engine. Easy to use, shows price graph and promotion alerts.',
      features: language === 'pt'
        ? ['Gráfico de preços', 'Alertas de promoção', 'Datas flexíveis', 'Gratuito']
        : ['Price graph', 'Promotion alerts', 'Flexible dates', 'Free'],
      url: 'https://www.google.com/travel/flights',
      recommended: true
    },
    {
      name: 'Skyscanner',
      logo: '🌐',
      color: 'from-cyan-500 to-teal-500',
      description: language === 'pt'
        ? 'Compara preços de centenas de companhias aéreas e agências. Ótimo para encontrar o melhor preço.'
        : 'Compares prices from hundreds of airlines and agencies. Great for finding the best price.',
      features: language === 'pt'
        ? ['Compara +1000 sites', 'Busca mês inteiro', 'App mobile', 'Alertas de preço']
        : ['Compares +1000 sites', 'Whole month search', 'Mobile app', 'Price alerts'],
      url: 'https://www.skyscanner.ie',
      recommended: true
    },
    {
      name: 'Kayak',
      logo: '🛫',
      color: 'from-orange-500 to-red-500',
      description: language === 'pt'
        ? 'Excelente para encontrar promoções e voos com escalas inteligentes. Interface limpa e fácil.'
        : 'Excellent for finding deals and flights with smart layovers. Clean and easy interface.',
      features: language === 'pt'
        ? ['Previsão de preços', 'Filtros avançados', 'Hacker fares', 'Muito visual']
        : ['Price forecast', 'Advanced filters', 'Hacker fares', 'Very visual'],
      url: 'https://www.kayak.ie',
      recommended: false
    },
    {
      name: 'Kiwi.com',
      logo: '🥝',
      color: 'from-green-500 to-emerald-500',
      description: language === 'pt'
        ? 'Especialista em rotas alternativas e combinações de voos. Pode encontrar preços mais baratos combinando companhias.'
        : 'Specialist in alternative routes and flight combinations. Can find cheaper prices by combining airlines.',
      features: language === 'pt'
        ? ['Rotas alternativas', 'Combina companhias', 'Garantia de conexão', 'Virtual Interlining']
        : ['Alternative routes', 'Combines airlines', 'Connection guarantee', 'Virtual Interlining'],
      url: 'https://www.kiwi.com',
      recommended: false
    }
  ];

  // Airlines
  const airlines = [
    {
      name: 'TAP Portugal',
      logo: '🇵🇹',
      color: 'from-red-600 to-green-600',
      type: language === 'pt' ? 'Companhia Tradicional' : 'Traditional Airline',
      description: language === 'pt'
        ? 'Voos diretos de São Paulo e Rio para Lisboa, com conexão para Dublin. A escolha mais popular entre brasileiros.'
        : 'Direct flights from São Paulo and Rio to Lisbon, with connection to Dublin. The most popular choice among Brazilians.',
      routes: language === 'pt'
        ? ['São Paulo → Lisboa → Dublin', 'Rio de Janeiro → Lisboa → Dublin', 'Brasília → Lisboa → Dublin']
        : ['São Paulo → Lisbon → Dublin', 'Rio de Janeiro → Lisbon → Dublin', 'Brasília → Lisbon → Dublin'],
      pros: language === 'pt'
        ? ['Voos frequentes', 'Bagagem incluída', 'Programa Miles&Go', 'Atendimento em português']
        : ['Frequent flights', 'Baggage included', 'Miles&Go program', 'Portuguese service'],
      url: 'https://www.flytap.com',
      priceRange: '€500-900'
    },
    {
      name: 'Aer Lingus',
      logo: '☘️',
      color: 'from-emerald-600 to-teal-600',
      type: language === 'pt' ? 'Companhia Irlandesa' : 'Irish Airline',
      description: language === 'pt'
        ? 'A companhia aérea da Irlanda! Voos de Lisboa e outras cidades europeias para Dublin. Ótimo serviço.'
        : 'Ireland\'s airline! Flights from Lisbon and other European cities to Dublin. Great service.',
      routes: language === 'pt'
        ? ['Lisboa → Dublin (direto)', 'Londres → Dublin', 'Paris → Dublin', 'Amsterdam → Dublin']
        : ['Lisbon → Dublin (direct)', 'London → Dublin', 'Paris → Dublin', 'Amsterdam → Dublin'],
      pros: language === 'pt'
        ? ['Companhia irlandesa', 'Voos diretos Europa-Dublin', 'Bom serviço', 'Programa Avios']
        : ['Irish airline', 'Direct Europe-Dublin flights', 'Good service', 'Avios program'],
      url: 'https://www.aerlingus.com',
      priceRange: '€50-300'
    },
    {
      name: 'Ryanair',
      logo: '💛',
      color: 'from-yellow-500 to-blue-600',
      type: language === 'pt' ? 'Low Cost' : 'Low Cost',
      description: language === 'pt'
        ? 'A maior low-cost da Europa! Voos muito baratos para viajar pela Europa nos fins de semana e férias.'
        : 'Europe\'s largest low-cost! Very cheap flights to travel around Europe on weekends and holidays.',
      routes: language === 'pt'
        ? ['Dublin → Londres (€10-30)', 'Dublin → Paris (€15-40)', 'Dublin → Barcelona (€20-50)', 'Dublin → Roma (€20-50)']
        : ['Dublin → London (€10-30)', 'Dublin → Paris (€15-40)', 'Dublin → Barcelona (€20-50)', 'Dublin → Rome (€20-50)'],
      pros: language === 'pt'
        ? ['Preços muito baixos', 'Muitos destinos', 'App fácil', 'Voos frequentes']
        : ['Very low prices', 'Many destinations', 'Easy app', 'Frequent flights'],
      cons: language === 'pt'
        ? ['Bagagem paga à parte', 'Taxas extras', 'Aeroportos secundários']
        : ['Baggage charged separately', 'Extra fees', 'Secondary airports'],
      url: 'https://www.ryanair.com',
      priceRange: '€10-100'
    }
  ];

  // Tips data
  const tips = [
    {
      icon: Calendar,
      title: language === 'pt' ? 'Melhor época para comprar' : 'Best time to buy',
      desc: language === 'pt'
        ? 'Compre com 2-3 meses de antecedência. Para alta temporada (verão/Natal), compre com 4-6 meses.'
        : 'Buy 2-3 months in advance. For high season (summer/Christmas), buy 4-6 months ahead.'
    },
    {
      icon: TrendingDown,
      title: language === 'pt' ? 'Dias mais baratos' : 'Cheapest days',
      desc: language === 'pt'
        ? 'Terça e quarta-feira costumam ter os preços mais baixos. Evite sexta e domingo.'
        : 'Tuesday and Wednesday usually have the lowest prices. Avoid Friday and Sunday.'
    },
    {
      icon: Compass,
      title: language === 'pt' ? 'Seja flexível' : 'Be flexible',
      desc: language === 'pt'
        ? 'Se puder, seja flexível nas datas. Uma diferença de 1-2 dias pode economizar centenas de euros.'
        : 'If you can, be flexible with dates. A difference of 1-2 days can save hundreds of euros.'
    },
    {
      icon: Search,
      title: language === 'pt' ? 'Compare sempre' : 'Always compare',
      desc: language === 'pt'
        ? 'Use pelo menos 2-3 buscadores diferentes. Às vezes o preço varia muito entre eles.'
        : 'Use at least 2-3 different search engines. Sometimes the price varies a lot between them.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="flights-page">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white py-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-9xl">✈️</div>
          <div className="absolute bottom-10 right-20 text-8xl">🌍</div>
          <div className="absolute top-1/2 right-1/3 text-6xl">☁️</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Plane className="h-8 w-8" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  {language === 'pt' ? 'Parceiros de Confiança' : 'Trusted Partners'}
                </Badge>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="flights-title">
                {language === 'pt' ? 'Passagens Aéreas' : 'Flight Tickets'}
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                {language === 'pt' 
                  ? 'Compare preços e encontre as melhores passagens para sua viagem à Irlanda. Indicamos os melhores buscadores e companhias aéreas.'
                  : 'Compare prices and find the best tickets for your trip to Ireland. We recommend the best search engines and airlines.'}
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
        
        {/* Quick tip */}
        <div className="mb-10 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
            <Lightbulb className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">
              💡 {language === 'pt' ? 'Dica Rápida' : 'Quick Tip'}
            </h3>
            <p className="text-amber-800 text-sm">
              {language === 'pt'
                ? 'Para voos Brasil → Dublin, a rota mais comum é via Lisboa (TAP). Compare sempre com voos via Londres, Paris ou Amsterdam que às vezes saem mais baratos!'
                : 'For Brazil → Dublin flights, the most common route is via Lisbon (TAP). Always compare with flights via London, Paris or Amsterdam which are sometimes cheaper!'}
            </p>
          </div>
        </div>

        {/* Search Engines Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Search className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-900">
                {language === 'pt' ? 'Buscadores de Passagens' : 'Flight Search Engines'}
              </h2>
              <p className="text-slate-500 text-sm">
                {language === 'pt' ? 'Compare preços em vários sites de uma vez' : 'Compare prices across multiple sites at once'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchEngines.map((engine, index) => (
              <Card 
                key={index} 
                className={`border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${engine.recommended ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
              >
                <div className={`h-2 bg-gradient-to-r ${engine.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{engine.logo}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-slate-900">{engine.name}</h3>
                          {engine.recommended && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              {language === 'pt' ? 'Recomendado' : 'Recommended'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4">{engine.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {engine.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <a
                    href={engine.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r ${engine.color} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md hover:shadow-lg`}
                  >
                    <Search className="h-4 w-4" />
                    {language === 'pt' ? 'Buscar Passagens' : 'Search Flights'}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Airlines Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Plane className="h-6 w-6 text-indigo-700" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-900">
                {language === 'pt' ? 'Companhias Aéreas' : 'Airlines'}
              </h2>
              <p className="text-slate-500 text-sm">
                {language === 'pt' ? 'Compre direto no site oficial' : 'Buy directly from the official website'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {airlines.map((airline, index) => (
              <Card key={index} className="border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${airline.color}`} />
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Left - Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">{airline.logo}</span>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{airline.name}</h3>
                          <Badge variant="secondary">{airline.type}</Badge>
                        </div>
                        <Badge className="bg-slate-100 text-slate-700 ml-auto">
                          {airline.priceRange}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-4">{airline.description}</p>
                      
                      {/* Routes */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                          ✈️ {language === 'pt' ? 'Rotas Populares' : 'Popular Routes'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {airline.routes.map((route, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                              {route}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pros */}
                      <div className="grid grid-cols-2 gap-2">
                        {airline.pros.map((pro, i) => (
                          <div key={i} className="flex items-center gap-1 text-sm text-emerald-700">
                            <CheckCircle className="h-3 w-3" />
                            {pro}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right - CTA */}
                    <div className="lg:w-48 flex flex-col gap-3">
                      <a
                        href={airline.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${airline.color} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md`}
                      >
                        <Globe className="h-4 w-4" />
                        {language === 'pt' ? 'Ver Site' : 'Visit Site'}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
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
              {language === 'pt' ? 'Dicas para Economizar' : 'Tips to Save Money'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tips.map((tip, index) => (
              <Card key={index} className="border-slate-100 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="p-2 bg-amber-100 rounded-xl w-fit mb-3">
                    <tip.icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-slate-600">{tip.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Route Info */}
        <Card className="border-slate-100 mb-12 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500" />
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🇧🇷</span>
              <ArrowRight className="h-6 w-6 text-slate-400" />
              <span className="text-4xl">🇮🇪</span>
              <h3 className="font-serif text-xl font-bold text-slate-900 ml-2">
                {language === 'pt' ? 'Brasil → Dublin: O que saber' : 'Brazil → Dublin: What to know'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  <h4 className="font-semibold text-slate-900">
                    {language === 'pt' ? 'Duração do Voo' : 'Flight Duration'}
                  </h4>
                </div>
                <p className="text-2xl font-bold text-indigo-600 mb-1">11-14h</p>
                <p className="text-sm text-slate-500">
                  {language === 'pt' ? 'Com 1 conexão (geralmente Lisboa)' : 'With 1 connection (usually Lisbon)'}
                </p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="h-5 w-5 text-slate-600" />
                  <h4 className="font-semibold text-slate-900">
                    {language === 'pt' ? 'Preço Médio' : 'Average Price'}
                  </h4>
                </div>
                <p className="text-2xl font-bold text-emerald-600 mb-1">€500-900</p>
                <p className="text-sm text-slate-500">
                  {language === 'pt' ? 'Ida e volta, classe econômica' : 'Round trip, economy class'}
                </p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-slate-600" />
                  <h4 className="font-semibold text-slate-900">
                    {language === 'pt' ? 'Aeroporto Dublin' : 'Dublin Airport'}
                  </h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-1">DUB</p>
                <p className="text-sm text-slate-500">
                  {language === 'pt' ? '12km do centro da cidade' : '12km from city center'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="text-center p-8 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-3xl border border-sky-100">
          <div className="text-5xl mb-4">✈️</div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">
            {language === 'pt' ? 'Pronto para voar?' : 'Ready to fly?'}
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-6">
            {language === 'pt'
              ? 'Compare os preços nos buscadores acima e encontre a melhor oferta para sua viagem à Irlanda!'
              : 'Compare prices on the search engines above and find the best deal for your trip to Ireland!'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://www.google.com/travel/flights"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Search className="h-5 w-5" />
              Google Flights
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://www.skyscanner.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors shadow-lg"
            >
              <Globe className="h-5 w-5" />
              Skyscanner
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
