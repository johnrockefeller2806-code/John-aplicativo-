import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { 
  MapPin, 
  Bus, 
  Train,
  Clock,
  Euro,
  Search,
  ExternalLink,
  Navigation,
  Utensils,
  Building,
  Shield,
  Phone,
  Camera,
  ChevronLeft,
  ChevronRight,
  Star,
  Info
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

// Dados dos lugares turísticos
const touristPlaces = [
  {
    id: 1,
    name: "Trinity College Dublin",
    name_pt: "Trinity College Dublin",
    description: "Ireland's oldest university, home to the famous Book of Kells and the stunning Long Room library.",
    description_pt: "A universidade mais antiga da Irlanda, lar do famoso Livro de Kells e da impressionante biblioteca Long Room.",
    address: "College Green, Dublin 2",
    coordinates: { lat: 53.3438, lng: -6.2546 },
    openingHours: "08:30 - 17:00",
    price: "€18.00",
    priceNote: "Entrada para Book of Kells",
    category: "historic",
    images: [
      "https://images.unsplash.com/photo-1565686256067-a0e6c2f07f82?w=800",
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
    transport: {
      bus: ["1", "4", "7", "8", "15", "46A", "49", "54A", "56A", "77A", "83", "150"],
      luas: "St. Stephen's Green (Green Line)",
      dart: "Pearse Station ou Tara Street",
      walkTime: "Centro da cidade - 5 min a pé"
    },
    nearbyRestaurants: [
      { name: "The Buttery", type: "Café/Restaurante", distance: "0 min" },
      { name: "Fallon & Byrne", type: "Gastropub", distance: "5 min" },
      { name: "Fade Street Social", type: "Restaurante", distance: "7 min" }
    ],
    nearbyHostels: [
      { name: "Generator Dublin", distance: "10 min", price: "€25/noite" },
      { name: "Barnacles Temple Bar", distance: "8 min", price: "€30/noite" }
    ],
    nearbyGarda: {
      name: "Pearse Street Garda Station",
      address: "Pearse Street, Dublin 2",
      phone: "+353 1 666 9000",
      distance: "5 min"
    },
    nearbyHospital: {
      name: "St. James's Hospital",
      address: "James's Street, Dublin 8",
      phone: "+353 1 410 3000",
      distance: "15 min"
    }
  },
  {
    id: 2,
    name: "Temple Bar",
    name_pt: "Temple Bar",
    description: "Dublin's cultural quarter known for its vibrant nightlife, street performers, and traditional Irish pubs.",
    description_pt: "O bairro cultural de Dublin, conhecido pela vida noturna vibrante, artistas de rua e pubs irlandeses tradicionais.",
    address: "Temple Bar, Dublin 2",
    coordinates: { lat: 53.3456, lng: -6.2643 },
    openingHours: "24 horas (área pública)",
    price: "Grátis",
    priceNote: "Área pública",
    category: "entertainment",
    images: [
      "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800",
      "https://images.unsplash.com/photo-1565686256067-a0e6c2f07f82?w=800",
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800"
    ],
    transport: {
      bus: ["25", "26", "37", "39", "49", "51D", "54A", "56A", "77A", "150"],
      luas: "Westmoreland (Red Line) ou St. Stephen's Green (Green Line)",
      dart: "Tara Street",
      walkTime: "Centro da cidade - 2 min a pé"
    },
    nearbyRestaurants: [
      { name: "The Temple Bar Pub", type: "Pub Irlandês", distance: "0 min" },
      { name: "Elephant & Castle", type: "Americano", distance: "2 min" },
      { name: "Gallagher's Boxty House", type: "Irlandês", distance: "3 min" }
    ],
    nearbyHostels: [
      { name: "Barnacles Temple Bar", distance: "1 min", price: "€30/noite" },
      { name: "The Oliver St. John Gogarty", distance: "2 min", price: "€35/noite" }
    ],
    nearbyGarda: {
      name: "Pearse Street Garda Station",
      address: "Pearse Street, Dublin 2",
      phone: "+353 1 666 9000",
      distance: "7 min"
    },
    nearbyHospital: {
      name: "Mater Misericordiae Hospital",
      address: "Eccles Street, Dublin 7",
      phone: "+353 1 803 2000",
      distance: "20 min"
    }
  },
  {
    id: 3,
    name: "Dublin Castle",
    name_pt: "Castelo de Dublin",
    description: "Historic castle and government complex dating back to the 13th century, now open for tours.",
    description_pt: "Castelo histórico e complexo governamental que remonta ao século XIII, agora aberto para visitas.",
    address: "Dame Street, Dublin 2",
    coordinates: { lat: 53.3429, lng: -6.2674 },
    openingHours: "09:45 - 17:45",
    price: "€12.00",
    priceNote: "Tour guiado",
    category: "historic",
    images: [
      "https://images.unsplash.com/photo-1564959130747-897fb406b9af?w=800",
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800",
      "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800"
    ],
    transport: {
      bus: ["13", "27", "40", "49", "54A", "56A", "77A", "123", "150"],
      luas: "St. Stephen's Green (Green Line)",
      dart: "Tara Street",
      walkTime: "Centro da cidade - 5 min a pé"
    },
    nearbyRestaurants: [
      { name: "The Church", type: "Restaurante/Bar", distance: "10 min" },
      { name: "Queen of Tarts", type: "Café/Padaria", distance: "3 min" },
      { name: "Cleaver East", type: "Contemporâneo", distance: "5 min" }
    ],
    nearbyHostels: [
      { name: "Kinlay House Dublin", distance: "5 min", price: "€28/noite" },
      { name: "Jacob's Inn", distance: "8 min", price: "€32/noite" }
    ],
    nearbyGarda: {
      name: "Kevin Street Garda Station",
      address: "Kevin Street Upper, Dublin 8",
      phone: "+353 1 666 9400",
      distance: "8 min"
    },
    nearbyHospital: {
      name: "St. James's Hospital",
      address: "James's Street, Dublin 8",
      phone: "+353 1 410 3000",
      distance: "12 min"
    }
  },
  {
    id: 4,
    name: "Guinness Storehouse",
    name_pt: "Guinness Storehouse",
    description: "Ireland's most popular tourist attraction - discover the history of Guinness and enjoy a pint with panoramic views.",
    description_pt: "A atração turística mais popular da Irlanda - descubra a história da Guinness e aprecie uma pint com vista panorâmica.",
    address: "St. James's Gate, Dublin 8",
    coordinates: { lat: 53.3419, lng: -6.2868 },
    openingHours: "10:00 - 19:00",
    price: "€26.00",
    priceNote: "Inclui 1 pint",
    category: "attraction",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800",
      "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800"
    ],
    transport: {
      bus: ["13", "40", "123"],
      luas: "James's (Red Line) - 10 min a pé",
      dart: "Heuston Station - 15 min a pé",
      walkTime: "Centro da cidade - 20 min a pé"
    },
    nearbyRestaurants: [
      { name: "1837 Bar & Brasserie (dentro)", type: "Gastropub", distance: "0 min" },
      { name: "Arthur's Bar & Grill (dentro)", type: "Bar/Grill", distance: "0 min" },
      { name: "The Old Royal Oak", type: "Pub", distance: "5 min" }
    ],
    nearbyHostels: [
      { name: "Generator Dublin", distance: "20 min", price: "€25/noite" },
      { name: "Avalon House", distance: "15 min", price: "€27/noite" }
    ],
    nearbyGarda: {
      name: "Kevin Street Garda Station",
      address: "Kevin Street Upper, Dublin 8",
      phone: "+353 1 666 9400",
      distance: "10 min"
    },
    nearbyHospital: {
      name: "St. James's Hospital",
      address: "James's Street, Dublin 8",
      phone: "+353 1 410 3000",
      distance: "5 min"
    }
  },
  {
    id: 5,
    name: "Phoenix Park",
    name_pt: "Phoenix Park",
    description: "One of Europe's largest enclosed parks, home to Dublin Zoo, wild deer, and the President's residence.",
    description_pt: "Um dos maiores parques urbanos da Europa, lar do Zoológico de Dublin, cervos selvagens e residência do Presidente.",
    address: "Phoenix Park, Dublin 8",
    coordinates: { lat: 53.3559, lng: -6.3298 },
    openingHours: "24 horas",
    price: "Grátis",
    priceNote: "Parque gratuito (Zoo pago)",
    category: "nature",
    images: [
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800",
      "https://images.unsplash.com/photo-1565686256067-a0e6c2f07f82?w=800",
      "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800"
    ],
    transport: {
      bus: ["37", "38", "39", "46A", "70"],
      luas: "Heuston (Red Line) - 15 min a pé",
      dart: "Não disponível",
      walkTime: "Centro da cidade - 35 min a pé"
    },
    nearbyRestaurants: [
      { name: "Phoenix Café", type: "Café", distance: "5 min" },
      { name: "Hole in the Wall", type: "Pub", distance: "10 min" },
      { name: "Farmleigh Café", type: "Café", distance: "15 min" }
    ],
    nearbyHostels: [
      { name: "Phoenix Park Inn", distance: "10 min", price: "€45/noite" },
      { name: "Ashling Hotel", distance: "15 min", price: "€80/noite" }
    ],
    nearbyGarda: {
      name: "Phoenix Park Garda Station",
      address: "Phoenix Park, Dublin 8",
      phone: "+353 1 666 0000",
      distance: "10 min"
    },
    nearbyHospital: {
      name: "Connolly Hospital",
      address: "Blanchardstown, Dublin 15",
      phone: "+353 1 646 5000",
      distance: "20 min"
    }
  },
  {
    id: 6,
    name: "St. Patrick's Cathedral",
    name_pt: "Catedral de São Patrício",
    description: "The largest church in Ireland, founded in 1191, with beautiful architecture and rich history.",
    description_pt: "A maior igreja da Irlanda, fundada em 1191, com arquitetura deslumbrante e história rica.",
    address: "St Patrick's Close, Dublin 8",
    coordinates: { lat: 53.3394, lng: -6.2716 },
    openingHours: "09:30 - 17:00",
    price: "€9.00",
    priceNote: "Entrada adulto",
    category: "historic",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1564959130747-897fb406b9af?w=800",
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800"
    ],
    transport: {
      bus: ["49", "54A", "56A", "77A", "150", "151"],
      luas: "St. Stephen's Green (Green Line) - 10 min a pé",
      dart: "Tara Street - 15 min a pé",
      walkTime: "Centro da cidade - 10 min a pé"
    },
    nearbyRestaurants: [
      { name: "The Liberties Gate", type: "Pub", distance: "3 min" },
      { name: "Christchurch Café", type: "Café", distance: "5 min" },
      { name: "Bull & Castle", type: "Gastropub", distance: "7 min" }
    ],
    nearbyHostels: [
      { name: "Kinlay House Dublin", distance: "5 min", price: "€28/noite" },
      { name: "Four Courts Hostel", distance: "12 min", price: "€26/noite" }
    ],
    nearbyGarda: {
      name: "Kevin Street Garda Station",
      address: "Kevin Street Upper, Dublin 8",
      phone: "+353 1 666 9400",
      distance: "5 min"
    },
    nearbyHospital: {
      name: "St. James's Hospital",
      address: "James's Street, Dublin 8",
      phone: "+353 1 410 3000",
      distance: "10 min"
    }
  },
  {
    id: 7,
    name: "Grafton Street",
    name_pt: "Grafton Street",
    description: "Dublin's premier shopping street with buskers, shops, and cafés - pedestrian only.",
    description_pt: "A principal rua de compras de Dublin com artistas de rua, lojas e cafés - apenas pedestres.",
    address: "Grafton Street, Dublin 2",
    coordinates: { lat: 53.3418, lng: -6.2593 },
    openingHours: "24 horas (lojas variam)",
    price: "Grátis",
    priceNote: "Rua pública",
    category: "shopping",
    images: [
      "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800",
      "https://images.unsplash.com/photo-1565686256067-a0e6c2f07f82?w=800",
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800"
    ],
    transport: {
      bus: ["11", "14", "15", "20B", "27", "33", "39A", "41", "46A"],
      luas: "St. Stephen's Green (Green Line)",
      dart: "Pearse Station",
      walkTime: "Centro da cidade - 0 min"
    },
    nearbyRestaurants: [
      { name: "Bewley's Café", type: "Café Histórico", distance: "0 min" },
      { name: "Cornucopia", type: "Vegetariano", distance: "2 min" },
      { name: "Dunne & Crescenzi", type: "Italiano", distance: "3 min" }
    ],
    nearbyHostels: [
      { name: "Avalon House", distance: "5 min", price: "€27/noite" },
      { name: "Abbey Court Hostel", distance: "10 min", price: "€29/noite" }
    ],
    nearbyGarda: {
      name: "Pearse Street Garda Station",
      address: "Pearse Street, Dublin 2",
      phone: "+353 1 666 9000",
      distance: "8 min"
    },
    nearbyHospital: {
      name: "St. Vincent's Hospital",
      address: "Elm Park, Dublin 4",
      phone: "+353 1 221 4000",
      distance: "25 min"
    }
  },
  {
    id: 8,
    name: "Ha'penny Bridge",
    name_pt: "Ha'penny Bridge",
    description: "Dublin's iconic pedestrian bridge over the River Liffey, built in 1816.",
    description_pt: "A icônica ponte de pedestres de Dublin sobre o Rio Liffey, construída em 1816.",
    address: "Ha'penny Bridge, Dublin 1",
    coordinates: { lat: 53.3466, lng: -6.2631 },
    openingHours: "24 horas",
    price: "Grátis",
    priceNote: "Acesso público",
    category: "landmark",
    images: [
      "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800",
      "https://images.unsplash.com/photo-1565686256067-a0e6c2f07f82?w=800",
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800"
    ],
    transport: {
      bus: ["25", "25A", "25B", "26", "66", "67"],
      luas: "Jervis (Red Line)",
      dart: "Tara Street",
      walkTime: "Centro da cidade - 0 min"
    },
    nearbyRestaurants: [
      { name: "The Winding Stair", type: "Irlandês Moderno", distance: "1 min" },
      { name: "Brother Hubbard", type: "Café", distance: "5 min" },
      { name: "The Woollen Mills", type: "Contemporâneo", distance: "2 min" }
    ],
    nearbyHostels: [
      { name: "Generator Dublin", distance: "3 min", price: "€25/noite" },
      { name: "Jacob's Inn", distance: "5 min", price: "€32/noite" }
    ],
    nearbyGarda: {
      name: "Store Street Garda Station",
      address: "Store Street, Dublin 1",
      phone: "+353 1 666 8000",
      distance: "10 min"
    },
    nearbyHospital: {
      name: "Mater Misericordiae Hospital",
      address: "Eccles Street, Dublin 7",
      phone: "+353 1 803 2000",
      distance: "15 min"
    }
  }
];

// Categorias
const categories = [
  { id: 'all', name: 'Todos', name_pt: 'Todos', icon: '🗺️' },
  { id: 'historic', name: 'Historic', name_pt: 'Histórico', icon: '🏛️' },
  { id: 'attraction', name: 'Attractions', name_pt: 'Atrações', icon: '🎢' },
  { id: 'nature', name: 'Nature', name_pt: 'Natureza', icon: '🌳' },
  { id: 'entertainment', name: 'Entertainment', name_pt: 'Entretenimento', icon: '🎭' },
  { id: 'shopping', name: 'Shopping', name_pt: 'Compras', icon: '🛍️' },
  { id: 'landmark', name: 'Landmarks', name_pt: 'Pontos de Referência', icon: '📍' }
];

// Componente de Galeria de Imagens
const ImageGallery = ({ images, placeName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative h-64 md:h-80 bg-gray-100 rounded-xl overflow-hidden group">
      <img
        src={images[currentIndex]}
        alt={`${placeName} - ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5 text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5 text-gray-800" />
          </button>
        </>
      )}
      
      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Image counter */}
      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <Camera className="h-3 w-3" />
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
};

// Componente de Card de Lugar
const PlaceCard = ({ place, language, onClick }) => {
  const getCategoryIcon = (cat) => categories.find(c => c.id === cat)?.icon || '📍';
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border-gray-100"
      onClick={() => onClick(place)}
      data-testid={`place-card-${place.id}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={place.images[0]}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
          {getCategoryIcon(place.category)} {language === 'pt' ? categories.find(c => c.id === place.category)?.name_pt : categories.find(c => c.id === place.category)?.name}
        </Badge>
        <Badge className={`absolute top-3 right-3 ${place.price === 'Grátis' ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
          {place.price}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
          {language === 'pt' ? place.name_pt : place.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {language === 'pt' ? place.description_pt : place.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-gray-400">
            <MapPin className="h-4 w-4" />
            {place.address.split(',')[0]}
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <Clock className="h-4 w-4" />
            {place.openingHours.split(' - ')[0]}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Página Principal
export const Tourism = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [detailTab, setDetailTab] = useState('info');

  const filteredPlaces = touristPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          place.name_pt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          place.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openGoogleMaps = (place, type = 'place') => {
    let url;
    if (type === 'directions') {
      url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}&travelmode=transit`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`;
    }
    window.open(url, '_blank');
  };

  const openGoogleMapsAddress = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', Dublin, Ireland')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="tourism-page">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="tourism-title">
                {language === 'pt' ? '🗺️ Turismo Dublin' : '🗺️ Dublin Tourism'}
              </h1>
              <p className="text-emerald-100 text-lg max-w-2xl">
                {language === 'pt' 
                  ? 'Descubra os melhores lugares de Dublin com informações de transporte, restaurantes e serviços de emergência.'
                  : 'Discover the best places in Dublin with transport info, restaurants, and emergency services.'}
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

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 -mt-6">
        <Card className="border-none shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={language === 'pt' ? 'Buscar lugares...' : 'Search places...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  data-testid="tourism-search"
                />
              </div>
            </div>
            
            {/* Category Pills */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full whitespace-nowrap ${
                    selectedCategory === cat.id 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                  }`}
                  data-testid={`category-${cat.id}`}
                >
                  {cat.icon} {language === 'pt' ? cat.name_pt : cat.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Places Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              language={language}
              onClick={setSelectedPlace}
            />
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {language === 'pt' ? 'Nenhum lugar encontrado.' : 'No places found.'}
            </p>
          </div>
        )}
      </div>

      {/* Place Detail Modal */}
      <Dialog open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedPlace && (
            <>
              <DialogHeader className="p-0">
                <ImageGallery images={selectedPlace.images} placeName={selectedPlace.name} />
              </DialogHeader>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <DialogTitle className="text-2xl font-serif font-bold text-gray-800">
                      {language === 'pt' ? selectedPlace.name_pt : selectedPlace.name}
                    </DialogTitle>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {selectedPlace.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${selectedPlace.price === 'Grátis' ? 'bg-emerald-500' : 'bg-amber-500'} text-white text-lg px-3 py-1`}>
                      {selectedPlace.price}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1">{selectedPlace.priceNote}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {language === 'pt' ? selectedPlace.description_pt : selectedPlace.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button 
                    onClick={() => openGoogleMaps(selectedPlace)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {language === 'pt' ? 'Ver no Mapa' : 'View on Map'}
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                  <Button 
                    onClick={() => openGoogleMaps(selectedPlace, 'directions')}
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {language === 'pt' ? 'Como Chegar' : 'Get Directions'}
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </div>

                {/* Tabs */}
                <Tabs value={detailTab} onValueChange={setDetailTab}>
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="info" className="text-xs md:text-sm">
                      <Info className="h-4 w-4 mr-1 hidden md:inline" />
                      Info
                    </TabsTrigger>
                    <TabsTrigger value="transport" className="text-xs md:text-sm">
                      <Bus className="h-4 w-4 mr-1 hidden md:inline" />
                      {language === 'pt' ? 'Transporte' : 'Transport'}
                    </TabsTrigger>
                    <TabsTrigger value="food" className="text-xs md:text-sm">
                      <Utensils className="h-4 w-4 mr-1 hidden md:inline" />
                      {language === 'pt' ? 'Comida' : 'Food'}
                    </TabsTrigger>
                    <TabsTrigger value="emergency" className="text-xs md:text-sm">
                      <Shield className="h-4 w-4 mr-1 hidden md:inline" />
                      {language === 'pt' ? 'Emergência' : 'Emergency'}
                    </TabsTrigger>
                  </TabsList>

                  {/* Info Tab */}
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500 text-sm">{language === 'pt' ? 'Horário' : 'Hours'}</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Clock className="h-4 w-4 text-emerald-600" />
                          {selectedPlace.openingHours}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500 text-sm">{language === 'pt' ? 'Preço' : 'Price'}</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Euro className="h-4 w-4 text-emerald-600" />
                          {selectedPlace.price}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Transport Tab */}
                  <TabsContent value="transport" className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Bus className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-800">Dublin Bus</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedPlace.transport.bus.map((bus) => (
                            <Badge key={bus} variant="secondary" className="bg-blue-100 text-blue-700">
                              {bus}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Train className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800">Luas</span>
                        </div>
                        <p className="text-green-700">{selectedPlace.transport.luas}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Train className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">DART</span>
                        </div>
                        <p className="text-purple-700">{selectedPlace.transport.dart}</p>
                      </div>
                      
                      <div className="bg-gray-100 p-4 rounded-xl">
                        <p className="text-gray-600">🚶 {selectedPlace.transport.walkTime}</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Food Tab */}
                  <TabsContent value="food" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-orange-500" />
                        {language === 'pt' ? 'Restaurantes Próximos' : 'Nearby Restaurants'}
                      </h4>
                      <div className="space-y-2">
                        {selectedPlace.nearbyRestaurants.map((rest, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                            onClick={() => openGoogleMapsAddress(rest.name + ', Dublin')}
                          >
                            <div>
                              <p className="font-medium text-gray-800">{rest.name}</p>
                              <p className="text-sm text-gray-500">{rest.type}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{rest.distance}</Badge>
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Building className="h-4 w-4 text-indigo-500" />
                        {language === 'pt' ? 'Hostels/Hotéis' : 'Hostels/Hotels'}
                      </h4>
                      <div className="space-y-2">
                        {selectedPlace.nearbyHostels.map((hostel, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                            onClick={() => openGoogleMapsAddress(hostel.name + ', Dublin')}
                          >
                            <div>
                              <p className="font-medium text-gray-800">{hostel.name}</p>
                              <p className="text-sm text-emerald-600">{hostel.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{hostel.distance}</Badge>
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Emergency Tab */}
                  <TabsContent value="emergency" className="space-y-4">
                    {/* Garda */}
                    <div 
                      className="bg-blue-50 p-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => openGoogleMapsAddress(selectedPlace.nearbyGarda.address)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Shield className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-800">{selectedPlace.nearbyGarda.name}</p>
                            <p className="text-sm text-blue-600">{selectedPlace.nearbyGarda.address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-blue-500 text-white">{selectedPlace.nearbyGarda.distance}</Badge>
                          <a 
                            href={`tel:${selectedPlace.nearbyGarda.phone}`}
                            className="flex items-center gap-1 text-blue-600 text-sm mt-1 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3 w-3" />
                            {selectedPlace.nearbyGarda.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Hospital */}
                    <div 
                      className="bg-red-50 p-4 rounded-xl cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => openGoogleMapsAddress(selectedPlace.nearbyHospital.address)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500 rounded-lg">
                            <span className="text-white text-xl">🏥</span>
                          </div>
                          <div>
                            <p className="font-semibold text-red-800">{selectedPlace.nearbyHospital.name}</p>
                            <p className="text-sm text-red-600">{selectedPlace.nearbyHospital.address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-red-500 text-white">{selectedPlace.nearbyHospital.distance}</Badge>
                          <a 
                            href={`tel:${selectedPlace.nearbyHospital.phone}`}
                            className="flex items-center gap-1 text-red-600 text-sm mt-1 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3 w-3" />
                            {selectedPlace.nearbyHospital.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Numbers */}
                    <div className="bg-gray-100 p-4 rounded-xl">
                      <p className="font-semibold mb-2">{language === 'pt' ? '📞 Números de Emergência' : '📞 Emergency Numbers'}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <a href="tel:999" className="flex items-center gap-2 text-red-600 hover:underline">
                          <Phone className="h-4 w-4" /> 999 - {language === 'pt' ? 'Emergência Geral' : 'General Emergency'}
                        </a>
                        <a href="tel:112" className="flex items-center gap-2 text-red-600 hover:underline">
                          <Phone className="h-4 w-4" /> 112 - {language === 'pt' ? 'Emergência EU' : 'EU Emergency'}
                        </a>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
