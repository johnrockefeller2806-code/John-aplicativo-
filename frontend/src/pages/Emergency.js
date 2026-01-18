import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Shield, 
  Hospital, 
  Pill,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  Navigation,
  Search,
  AlertTriangle,
  Info,
  Globe
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

// Garda Stations em Dublin
const gardaStations = [
  {
    id: 1,
    name: "Pearse Street Garda Station",
    address: "Pearse Street, Dublin 2",
    phone: "+353 1 666 9000",
    hours: "24 horas",
    area: "City Centre",
    coordinates: { lat: 53.3438, lng: -6.2489 }
  },
  {
    id: 2,
    name: "Store Street Garda Station",
    address: "Store Street, Dublin 1",
    phone: "+353 1 666 8000",
    hours: "24 horas",
    area: "City Centre",
    coordinates: { lat: 53.3502, lng: -6.2544 }
  },
  {
    id: 3,
    name: "Kevin Street Garda Station",
    address: "Kevin Street Upper, Dublin 8",
    phone: "+353 1 666 9400",
    hours: "24 horas",
    area: "Dublin 8",
    coordinates: { lat: 53.3369, lng: -6.2711 }
  },
  {
    id: 4,
    name: "Mountjoy Garda Station",
    address: "Fitzgibbon Street, Dublin 1",
    phone: "+353 1 666 8600",
    hours: "24 horas",
    area: "Dublin 1",
    coordinates: { lat: 53.3572, lng: -6.2603 }
  },
  {
    id: 5,
    name: "Bridewell Garda Station",
    address: "Chancery Street, Dublin 7",
    phone: "+353 1 666 8200",
    hours: "24 horas",
    area: "Dublin 7",
    coordinates: { lat: 53.3478, lng: -6.2756 }
  },
  {
    id: 6,
    name: "Crumlin Garda Station",
    address: "Sundrive Road, Crumlin, Dublin 12",
    phone: "+353 1 666 5200",
    hours: "24 horas",
    area: "Dublin 12",
    coordinates: { lat: 53.3208, lng: -6.3089 }
  },
  {
    id: 7,
    name: "Rathmines Garda Station",
    address: "Rathmines Road, Dublin 6",
    phone: "+353 1 666 6700",
    hours: "24 horas",
    area: "Dublin 6",
    coordinates: { lat: 53.3227, lng: -6.2644 }
  },
  {
    id: 8,
    name: "Dun Laoghaire Garda Station",
    address: "Corrig Avenue, Dun Laoghaire",
    phone: "+353 1 666 5000",
    hours: "24 horas",
    area: "Dun Laoghaire",
    coordinates: { lat: 53.2937, lng: -6.1344 }
  },
  {
    id: 9,
    name: "Dundrum Garda Station",
    address: "Dundrum Road, Dundrum, Dublin 14",
    phone: "+353 1 666 5600",
    hours: "24 horas",
    area: "Dublin 14",
    coordinates: { lat: 53.2922, lng: -6.2456 }
  },
  {
    id: 10,
    name: "Ballyfermot Garda Station",
    address: "Le Fanu Road, Ballyfermot, Dublin 10",
    phone: "+353 1 666 7200",
    hours: "24 horas",
    area: "Dublin 10",
    coordinates: { lat: 53.3422, lng: -6.3544 }
  },
  {
    id: 11,
    name: "Clontarf Garda Station",
    address: "Clontarf Road, Dublin 3",
    phone: "+353 1 666 4800",
    hours: "09:00 - 21:00",
    area: "Dublin 3",
    coordinates: { lat: 53.3636, lng: -6.2089 }
  },
  {
    id: 12,
    name: "Raheny Garda Station",
    address: "Howth Road, Raheny, Dublin 5",
    phone: "+353 1 666 4300",
    hours: "24 horas",
    area: "Dublin 5",
    coordinates: { lat: 53.3811, lng: -6.1778 }
  },
  {
    id: 13,
    name: "Coolock Garda Station",
    address: "Oscar Traynor Road, Coolock, Dublin 17",
    phone: "+353 1 666 4200",
    hours: "24 horas",
    area: "Dublin 17",
    coordinates: { lat: 53.3922, lng: -6.2044 }
  },
  {
    id: 14,
    name: "Blanchardstown Garda Station",
    address: "Roselawn Road, Blanchardstown, Dublin 15",
    phone: "+353 1 666 7000",
    hours: "24 horas",
    area: "Dublin 15",
    coordinates: { lat: 53.3867, lng: -6.3756 }
  },
  {
    id: 15,
    name: "Tallaght Garda Station",
    address: "The Square, Tallaght, Dublin 24",
    phone: "+353 1 666 6000",
    hours: "24 horas",
    area: "Dublin 24",
    coordinates: { lat: 53.2878, lng: -6.3744 }
  }
];

// Hospitais em Dublin
const hospitals = [
  {
    id: 1,
    name: "St. James's Hospital",
    address: "James's Street, Dublin 8",
    phone: "+353 1 410 3000",
    emergency: true,
    hours: "24 horas",
    coordinates: { lat: 53.3394, lng: -6.2944 }
  },
  {
    id: 2,
    name: "Mater Misericordiae Hospital",
    address: "Eccles Street, Dublin 7",
    phone: "+353 1 803 2000",
    emergency: true,
    hours: "24 horas",
    coordinates: { lat: 53.3600, lng: -6.2650 }
  },
  {
    id: 3,
    name: "St. Vincent's University Hospital",
    address: "Elm Park, Dublin 4",
    phone: "+353 1 221 4000",
    emergency: true,
    hours: "24 horas",
    coordinates: { lat: 53.3089, lng: -6.2189 }
  },
  {
    id: 4,
    name: "Beaumont Hospital",
    address: "Beaumont Road, Dublin 9",
    phone: "+353 1 809 3000",
    emergency: true,
    hours: "24 horas",
    coordinates: { lat: 53.3917, lng: -6.2222 }
  },
  {
    id: 5,
    name: "Tallaght University Hospital",
    address: "Tallaght, Dublin 24",
    phone: "+353 1 414 2000",
    emergency: true,
    hours: "24 horas",
    coordinates: { lat: 53.2889, lng: -6.3778 }
  },
  {
    id: 6,
    name: "Connolly Hospital",
    address: "Blanchardstown, Dublin 15",
    phone: "+353 1 646 5000",
    emergency: true,
    hours: "24 horas",
    coordinates: { lat: 53.3889, lng: -6.3778 }
  },
  {
    id: 7,
    name: "Temple Street Children's Hospital",
    address: "Temple Street, Dublin 1",
    phone: "+353 1 878 4200",
    emergency: true,
    hours: "24 horas (Pediatria)",
    coordinates: { lat: 53.3567, lng: -6.2633 }
  },
  {
    id: 8,
    name: "National Maternity Hospital",
    address: "Holles Street, Dublin 2",
    phone: "+353 1 637 3100",
    emergency: true,
    hours: "24 horas (Maternidade)",
    coordinates: { lat: 53.3389, lng: -6.2489 }
  }
];

// Farmácias 24h e Late Night
const pharmacies = [
  {
    id: 1,
    name: "Hickey's Pharmacy - O'Connell Street",
    address: "55 O'Connell Street Lower, Dublin 1",
    phone: "+353 1 873 0427",
    hours: "07:30 - 22:00",
    lateNight: true,
    coordinates: { lat: 53.3489, lng: -6.2600 }
  },
  {
    id: 2,
    name: "Boots - Grafton Street",
    address: "52 Grafton Street, Dublin 2",
    phone: "+353 1 677 0863",
    hours: "08:00 - 21:00",
    lateNight: true,
    coordinates: { lat: 53.3422, lng: -6.2594 }
  },
  {
    id: 3,
    name: "Lloyds Pharmacy - Dame Street",
    address: "43 Dame Street, Dublin 2",
    phone: "+353 1 670 4523",
    hours: "08:30 - 20:00",
    lateNight: false,
    coordinates: { lat: 53.3444, lng: -6.2644 }
  },
  {
    id: 4,
    name: "McCabes Pharmacy - Tallaght",
    address: "The Square, Tallaght, Dublin 24",
    phone: "+353 1 451 0022",
    hours: "09:00 - 21:00",
    lateNight: true,
    coordinates: { lat: 53.2878, lng: -6.3744 }
  },
  {
    id: 5,
    name: "Boots - Dun Laoghaire",
    address: "Unit 1, Bloomfield Shopping Centre, Dun Laoghaire",
    phone: "+353 1 280 0445",
    hours: "09:00 - 21:00",
    lateNight: true,
    coordinates: { lat: 53.2944, lng: -6.1356 }
  },
  {
    id: 6,
    name: "Hickey's Pharmacy - Blanchardstown",
    address: "Blanchardstown Shopping Centre, Dublin 15",
    phone: "+353 1 822 1800",
    hours: "09:00 - 21:00",
    lateNight: true,
    coordinates: { lat: 53.3889, lng: -6.3833 }
  }
];

// Números de emergência importantes
const emergencyNumbers = [
  {
    name: "Emergência Geral (Irlanda)",
    number: "999",
    description: "Garda, Ambulância, Bombeiros",
    icon: "🚨"
  },
  {
    name: "Emergência EU",
    number: "112",
    description: "Número europeu de emergência",
    icon: "🆘"
  },
  {
    name: "Garda Confidential Line",
    number: "1800 666 111",
    description: "Denúncias anônimas",
    icon: "🚔"
  },
  {
    name: "Samaritans (Apoio Emocional)",
    number: "116 123",
    description: "Suporte 24h - gratuito",
    icon: "💚"
  },
  {
    name: "HSE Live (Saúde)",
    number: "1800 700 700",
    description: "Informações de saúde",
    icon: "🏥"
  },
  {
    name: "Embaixada do Brasil",
    number: "+353 1 475 6000",
    description: "Europa House, Harcourt Street, Dublin 2",
    icon: "🇧🇷"
  },
  {
    name: "Consulado do Brasil",
    number: "+353 1 475 6000",
    description: "Atendimento consular",
    icon: "🇧🇷"
  },
  {
    name: "INIS Immigration",
    number: "+353 1 616 7700",
    description: "Questões de imigração",
    icon: "📋"
  }
];

export const Emergency = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('garda');

  const openGoogleMaps = (item, type = 'place') => {
    let url;
    if (type === 'directions') {
      url = `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates.lat},${item.coordinates.lng}&travelmode=transit`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`;
    }
    window.open(url, '_blank');
  };

  const filteredGarda = gardaStations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ServiceCard = ({ item, type }) => {
    const getIcon = () => {
      switch(type) {
        case 'garda': return <Shield className="h-6 w-6 text-blue-600" />;
        case 'hospital': return <Hospital className="h-6 w-6 text-red-600" />;
        case 'pharmacy': return <Pill className="h-6 w-6 text-green-600" />;
        default: return <MapPin className="h-6 w-6" />;
      }
    };

    const getBgColor = () => {
      switch(type) {
        case 'garda': return 'bg-blue-50 hover:bg-blue-100';
        case 'hospital': return 'bg-red-50 hover:bg-red-100';
        case 'pharmacy': return 'bg-green-50 hover:bg-green-100';
        default: return 'bg-gray-50 hover:bg-gray-100';
      }
    };

    const getBorderColor = () => {
      switch(type) {
        case 'garda': return 'border-blue-200';
        case 'hospital': return 'border-red-200';
        case 'pharmacy': return 'border-green-200';
        default: return 'border-gray-200';
      }
    };

    return (
      <Card className={`${getBgColor()} border ${getBorderColor()} transition-all cursor-pointer`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${type === 'garda' ? 'bg-blue-100' : type === 'hospital' ? 'bg-red-100' : 'bg-green-100'}`}>
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                <MapPin className="h-3 w-3" />
                {item.address}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.hours}
                </Badge>
                {item.emergency && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {language === 'pt' ? 'Urgência' : 'Emergency'}
                  </Badge>
                )}
                {item.lateNight && (
                  <Badge className="bg-purple-500 text-white text-xs">
                    {language === 'pt' ? 'Late Night' : 'Late Night'}
                  </Badge>
                )}
                {item.area && (
                  <Badge variant="outline" className="text-xs">
                    {item.area}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <a 
                  href={`tel:${item.phone}`}
                  className="inline-flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="h-3 w-3" />
                  {language === 'pt' ? 'Ligar' : 'Call'}
                </a>
                <button 
                  onClick={() => openGoogleMaps(item)}
                  className="inline-flex items-center gap-1 bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  {language === 'pt' ? 'Ver Mapa' : 'View Map'}
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button 
                  onClick={() => openGoogleMaps(item, 'directions')}
                  className="inline-flex items-center gap-1 bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <Navigation className="h-3 w-3" />
                  {language === 'pt' ? 'Como Chegar' : 'Directions'}
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="emergency-page">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3" data-testid="emergency-title">
                <AlertTriangle className="h-10 w-10" />
                {language === 'pt' ? 'Emergência' : 'Emergency'}
              </h1>
              <p className="text-red-100 text-lg max-w-2xl">
                {language === 'pt' 
                  ? 'Encontre delegacias, hospitais e farmácias em Dublin. Salve esta página para emergências!'
                  : 'Find police stations, hospitals and pharmacies in Dublin. Save this page for emergencies!'}
              </p>
            </div>
            <img 
              src={LOGO_URL} 
              alt="STUFF" 
              className="h-16 md:h-20 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-xl p-2 hidden sm:block"
            />
          </div>
        </div>
      </div>

      {/* Emergency Numbers Banner */}
      <div className="bg-red-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            <a href="tel:999" className="flex items-center gap-2 hover:scale-105 transition-transform">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="text-xs text-red-200">{language === 'pt' ? 'Emergência' : 'Emergency'}</p>
                <p className="text-xl font-bold">999</p>
              </div>
            </a>
            <a href="tel:112" className="flex items-center gap-2 hover:scale-105 transition-transform">
              <span className="text-2xl">🆘</span>
              <div>
                <p className="text-xs text-red-200">EU Emergency</p>
                <p className="text-xl font-bold">112</p>
              </div>
            </a>
            <a href="tel:+35314756000" className="flex items-center gap-2 hover:scale-105 transition-transform">
              <span className="text-2xl">🇧🇷</span>
              <div>
                <p className="text-xs text-red-200">{language === 'pt' ? 'Embaixada Brasil' : 'Brazil Embassy'}</p>
                <p className="text-lg font-bold">+353 1 475 6000</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
        {/* Search */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={language === 'pt' ? 'Buscar por nome, endereço ou área...' : 'Search by name, address or area...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-xl"
                data-testid="emergency-search"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-100 p-1 h-auto flex-wrap">
            <TabsTrigger 
              value="garda"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
              data-testid="tab-garda"
            >
              <Shield className="h-4 w-4 mr-1" />
              Garda ({filteredGarda.length})
            </TabsTrigger>
            <TabsTrigger 
              value="hospitals"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white hover:bg-red-100 hover:text-red-700 transition-all duration-200"
              data-testid="tab-hospitals"
            >
              <Hospital className="h-4 w-4 mr-1" />
              {language === 'pt' ? 'Hospitais' : 'Hospitals'} ({filteredHospitals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="pharmacies"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-100 hover:text-green-700 transition-all duration-200"
              data-testid="tab-pharmacies"
            >
              <Pill className="h-4 w-4 mr-1" />
              {language === 'pt' ? 'Farmácias' : 'Pharmacies'} ({filteredPharmacies.length})
            </TabsTrigger>
            <TabsTrigger 
              value="numbers"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-amber-100 hover:text-amber-700 transition-all duration-200"
              data-testid="tab-numbers"
            >
              <Phone className="h-4 w-4 mr-1" />
              {language === 'pt' ? 'Telefones' : 'Numbers'}
            </TabsTrigger>
          </TabsList>

          {/* Garda Tab */}
          <TabsContent value="garda">
            <div className="mb-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      {language === 'pt' 
                        ? 'A Garda Síochána é a polícia nacional da Irlanda. Em caso de emergência, ligue 999 ou 112.'
                        : 'An Garda Síochána is Ireland\'s national police. In case of emergency, call 999 or 112.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGarda.map(station => (
                <ServiceCard key={station.id} item={station} type="garda" />
              ))}
            </div>
            {filteredGarda.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{language === 'pt' ? 'Nenhuma delegacia encontrada.' : 'No stations found.'}</p>
              </div>
            )}
          </TabsContent>

          {/* Hospitals Tab */}
          <TabsContent value="hospitals">
            <div className="mb-4">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800">
                      {language === 'pt' 
                        ? 'Para emergências médicas, ligue 999 ou 112. Os hospitais listados possuem pronto-socorro 24 horas.'
                        : 'For medical emergencies, call 999 or 112. Listed hospitals have 24-hour emergency departments.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHospitals.map(hospital => (
                <ServiceCard key={hospital.id} item={hospital} type="hospital" />
              ))}
            </div>
            {filteredHospitals.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Hospital className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{language === 'pt' ? 'Nenhum hospital encontrado.' : 'No hospitals found.'}</p>
              </div>
            )}
          </TabsContent>

          {/* Pharmacies Tab */}
          <TabsContent value="pharmacies">
            <div className="mb-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800">
                      {language === 'pt' 
                        ? 'Farmácias com horário estendido. Para medicamentos controlados, é necessário receita médica.'
                        : 'Pharmacies with extended hours. Prescription required for controlled medications.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPharmacies.map(pharmacy => (
                <ServiceCard key={pharmacy.id} item={pharmacy} type="pharmacy" />
              ))}
            </div>
            {filteredPharmacies.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{language === 'pt' ? 'Nenhuma farmácia encontrada.' : 'No pharmacies found.'}</p>
              </div>
            )}
          </TabsContent>

          {/* Emergency Numbers Tab */}
          <TabsContent value="numbers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyNumbers.map((item, index) => (
                <Card key={index} className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{item.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                        <a 
                          href={`tel:${item.number.replace(/\s/g, '')}`}
                          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-lg font-bold hover:bg-emerald-700 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          {item.number}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Brazilian Consular Info */}
            <Card className="mt-6 bg-gradient-to-r from-green-500 to-yellow-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🇧🇷</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {language === 'pt' ? 'Embaixada do Brasil em Dublin' : 'Brazilian Embassy in Dublin'}
                    </h3>
                    <p className="mb-1">Europa House, Harcourt Street, Dublin 2</p>
                    <p className="mb-3">
                      {language === 'pt' 
                        ? 'Atendimento: Segunda a Sexta, 09:00 - 13:00 e 14:00 - 17:00'
                        : 'Office hours: Monday to Friday, 09:00 - 13:00 and 14:00 - 17:00'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href="tel:+35314756000"
                        className="inline-flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        +353 1 475 6000
                      </a>
                      <a 
                        href="https://dublin.itamaraty.gov.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
