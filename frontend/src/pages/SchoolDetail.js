import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle,
  Users,
  ArrowLeft,
  Wifi,
  BookOpen,
  Coffee
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const SchoolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  const [school, setSchool] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchSchoolData();
  }, [id]);

  const fetchSchoolData = async () => {
    try {
      const [schoolRes, coursesRes] = await Promise.all([
        axios.get(`${API}/schools/${id}`),
        axios.get(`${API}/schools/${id}/courses`)
      ]);
      setSchool(schoolRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching school:', error);
      navigate('/schools');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (course) => {
    if (!isAuthenticated) {
      toast.error(language === 'pt' ? 'Faça login para se matricular' : 'Login to enroll');
      navigate('/login');
      return;
    }
    setSelectedCourse(course);
    setSelectedDate(course.start_dates?.[0] || '');
    setEnrollDialogOpen(true);
  };

  const handleEnroll = async () => {
    if (!selectedCourse || !selectedDate) return;
    
    setEnrolling(true);
    try {
      const response = await axios.post(`${API}/enrollments?course_id=${selectedCourse.id}&start_date=${selectedDate}`);
      toast.success(language === 'pt' ? 'Matrícula criada! Redirecionando para pagamento...' : 'Enrollment created! Redirecting to payment...');
      setEnrollDialogOpen(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error creating enrollment');
    } finally {
      setEnrolling(false);
    }
  };

  const getLevelLabel = (level) => {
    const labels = {
      all_levels: language === 'pt' ? 'Todos os níveis' : 'All levels',
      beginner: language === 'pt' ? 'Iniciante' : 'Beginner',
      intermediate: language === 'pt' ? 'Intermediário' : 'Intermediate',
      advanced: language === 'pt' ? 'Avançado' : 'Advanced',
    };
    return labels[level] || level;
  };

  const getFacilityIcon = (facility) => {
    const icons = {
      'Wi-Fi': Wifi,
      'Biblioteca': BookOpen,
      'Cafeteria': Coffee,
    };
    return icons[facility] || CheckCircle;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12" data-testid="school-detail-loading">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Skeleton className="h-80 rounded-2xl mb-8" />
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-48 rounded-xl mb-4" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!school) return null;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="school-detail-page">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={school.image_url}
          alt={school.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/schools')}
              className="mb-4 bg-white/90 hover:bg-white"
              data-testid="back-button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* School Info */}
            <Card className="border-slate-100" data-testid="school-info-card">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {school.accreditation?.map((acc, i) => (
                    <Badge key={i} className="bg-emerald-100 text-emerald-800">
                      {acc}
                    </Badge>
                  ))}
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {school.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-amber-500 fill-current" />
                    <span className="font-medium text-slate-900">{school.rating}</span>
                    <span>({school.reviews_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-5 w-5" />
                    {school.address}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {language === 'pt' ? school.description : school.description_en}
                </p>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card className="border-slate-100" data-testid="facilities-card">
              <CardHeader>
                <CardTitle className="font-serif">
                  {language === 'pt' ? 'Instalações' : 'Facilities'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {school.facilities?.map((facility, i) => {
                    const Icon = getFacilityIcon(facility);
                    return (
                      <div key={i} className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <Icon className="h-5 w-5 text-emerald-700" />
                        </div>
                        {facility}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Courses */}
            <div data-testid="courses-section">
              <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-6">
                {language === 'pt' ? 'Cursos Disponíveis' : 'Available Courses'}
              </h2>
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card 
                    key={course.id} 
                    className="border-slate-100 hover:shadow-lg transition-shadow"
                    data-testid={`course-card-${course.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-slate-900 mb-2">
                            {language === 'pt' ? course.name : course.name_en}
                          </h3>
                          <p className="text-slate-500 text-sm mb-4">
                            {language === 'pt' ? course.description : course.description_en}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {course.duration_weeks} {t('course_weeks')} • {course.hours_per_week} {t('course_hours')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course.available_spots} {t('course_spots')}
                            </div>
                          </div>
                          <div className="mt-3">
                            <Badge variant="secondary">{getLevelLabel(course.level)}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-700 mb-2">
                            €{course.price.toLocaleString()}
                          </div>
                          <Button 
                            onClick={() => handleEnrollClick(course)}
                            className="bg-emerald-900 hover:bg-emerald-800"
                            data-testid={`enroll-button-${course.id}`}
                          >
                            {t('course_enroll')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-slate-100 sticky top-24" data-testid="sidebar-card">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                  {language === 'pt' ? 'Informações Rápidas' : 'Quick Info'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{language === 'pt' ? 'Localização' : 'Location'}</p>
                      <p className="font-medium">{school.city}, {school.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{language === 'pt' ? 'Cursos' : 'Courses'}</p>
                      <p className="font-medium">{courses.length} {language === 'pt' ? 'disponíveis' : 'available'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-2">{t('schools_from')}</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    €{Math.min(...courses.map(c => c.price)).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enrollment Dialog */}
      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent data-testid="enroll-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {language === 'pt' ? 'Confirmar Matrícula' : 'Confirm Enrollment'}
            </DialogTitle>
            <DialogDescription>
              {selectedCourse && (language === 'pt' ? selectedCourse.name : selectedCourse.name_en)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                {t('course_start_dates')}
              </label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger data-testid="date-select">
                  <SelectValue placeholder={language === 'pt' ? 'Selecione uma data' : 'Select a date'} />
                </SelectTrigger>
                <SelectContent>
                  {selectedCourse?.start_dates?.map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">{t('course_price')}</span>
                <span className="text-2xl font-bold text-emerald-700">
                  €{selectedCourse?.price?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleEnroll}
              disabled={!selectedDate || enrolling}
              className="bg-emerald-900 hover:bg-emerald-800"
              data-testid="confirm-enroll-button"
            >
              {enrolling ? t('loading') : t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
