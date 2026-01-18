import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Euro,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  
  const [stats, setStats] = useState(null);
  const [schools, setSchools] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
      return;
    }
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, authLoading]);

  const fetchData = async () => {
    try {
      const [statsRes, schoolsRes, usersRes, enrollmentsRes, paymentsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/admin/schools`),
        axios.get(`${API}/admin/users`),
        axios.get(`${API}/admin/enrollments`),
        axios.get(`${API}/admin/payments`)
      ]);
      setStats(statsRes.data);
      setSchools(schoolsRes.data);
      setUsers(usersRes.data);
      setEnrollments(enrollmentsRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSchool = async (schoolId) => {
    try {
      await axios.put(`${API}/admin/schools/${schoolId}/approve`);
      toast.success('Escola aprovada!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao aprovar escola');
    }
  };

  const handleRejectSchool = async (schoolId) => {
    try {
      await axios.put(`${API}/admin/schools/${schoolId}/reject`);
      toast.success('Escola rejeitada');
      fetchData();
    } catch (error) {
      toast.error('Erro ao rejeitar escola');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pendente', className: 'bg-amber-100 text-amber-800', icon: Clock },
      approved: { label: 'Aprovado', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      rejected: { label: 'Rejeitado', className: 'bg-red-100 text-red-800', icon: XCircle },
      paid: { label: 'Pago', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      initiated: { label: 'Iniciado', className: 'bg-blue-100 text-blue-800', icon: Clock },
    };
    const c = config[status] || config.pending;
    return (
      <Badge className={`${c.className} gap-1`}>
        <c.icon className="h-3 w-3" />
        {c.label}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12" data-testid="admin-loading">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-dashboard">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              Painel Administrativo
            </h1>
          </div>
          <p className="text-slate-400">Gerencie escolas, usuários e pagamentos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-12 mb-8">
          <Card className="border-slate-100 shadow-lg" data-testid="stat-users">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Usuários</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.total_users || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-100 shadow-lg" data-testid="stat-schools">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Building2 className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Escolas</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats?.approved_schools || 0}
                  {stats?.pending_schools > 0 && (
                    <span className="text-sm text-amber-600 ml-1">
                      (+{stats?.pending_schools} pendentes)
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-100 shadow-lg" data-testid="stat-enrollments">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <GraduationCap className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Matrículas</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.total_enrollments || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-100 shadow-lg" data-testid="stat-revenue">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Euro className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Receita Total</p>
                <p className="text-2xl font-bold text-slate-900">
                  €{((stats?.total_revenue || 0) + (stats?.plus_revenue || 0)).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PLUS Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50" data-testid="stat-plus-subscribers">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-amber-700 font-medium">Assinantes PLUS</p>
                  <p className="text-3xl font-bold text-amber-900">{stats?.plus_subscribers || 0}</p>
                </div>
              </div>
              <Badge className="bg-amber-500 text-white text-lg px-4 py-2">
                €{(stats?.plus_revenue || 0).toFixed(2)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-lg" data-testid="stat-conversion">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Taxa de Conversão PLUS</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats?.total_users > 0 
                    ? ((stats?.plus_subscribers || 0) / stats?.total_users * 100).toFixed(1)
                    : 0}%
                </p>
                <p className="text-xs text-slate-400">
                  {stats?.plus_subscribers || 0} de {stats?.total_users || 0} usuários
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-100 p-1">
            <TabsTrigger value="overview" data-testid="tab-overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="schools" data-testid="tab-schools">
              Escolas
              {stats?.pending_schools > 0 && (
                <Badge className="ml-2 bg-amber-500 text-white">{stats?.pending_schools}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Usuários</TabsTrigger>
            <TabsTrigger value="enrollments" data-testid="tab-enrollments">Matrículas</TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-payments">Pagamentos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Schools Alert */}
              {stats?.pending_schools > 0 && (
                <Card className="border-amber-200 bg-amber-50 lg:col-span-2">
                  <CardContent className="p-6 flex items-center gap-4">
                    <AlertCircle className="h-8 w-8 text-amber-600" />
                    <div>
                      <h3 className="font-semibold text-amber-900">
                        {stats?.pending_schools} escola(s) aguardando aprovação
                      </h3>
                      <p className="text-sm text-amber-700">
                        Revise as escolas pendentes na aba "Escolas"
                      </p>
                    </div>
                    <Button 
                      className="ml-auto bg-amber-600 hover:bg-amber-500"
                      onClick={() => setActiveTab('schools')}
                    >
                      Ver Pendentes
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Recent Enrollments */}
              <Card className="border-slate-100">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Matrículas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {enrollments.slice(0, 5).map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{enrollment.user_name}</p>
                          <p className="text-xs text-slate-500">{enrollment.course_name}</p>
                        </div>
                        {getStatusBadge(enrollment.status)}
                      </div>
                    ))}
                    {enrollments.length === 0 && (
                      <p className="text-slate-500 text-center py-4">Nenhuma matrícula ainda</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Payments */}
              <Card className="border-slate-100">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pagamentos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{payment.user_email}</p>
                          <p className="text-xs text-slate-500">€{payment.amount.toLocaleString()}</p>
                        </div>
                        {getStatusBadge(payment.status)}
                      </div>
                    ))}
                    {payments.length === 0 && (
                      <p className="text-slate-500 text-center py-4">Nenhum pagamento ainda</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools">
            <Card className="border-slate-100">
              <CardHeader>
                <CardTitle className="font-serif">Gerenciar Escolas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school.id} data-testid={`school-row-${school.id}`}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.email}</TableCell>
                        <TableCell>{school.address}</TableCell>
                        <TableCell>{getStatusBadge(school.status)}</TableCell>
                        <TableCell>
                          {school.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="bg-emerald-600 hover:bg-emerald-500"
                                onClick={() => handleApproveSchool(school.id)}
                                data-testid={`approve-${school.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRejectSchool(school.id)}
                                data-testid={`reject-${school.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeitar
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {schools.length === 0 && (
                  <p className="text-slate-500 text-center py-8">Nenhuma escola cadastrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-slate-100">
              <CardHeader>
                <CardTitle className="font-serif">Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cadastro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                            {u.role === 'student' ? 'Estudante' : u.role === 'school' ? 'Escola' : 'Admin'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enrollments Tab */}
          <TabsContent value="enrollments">
            <Card className="border-slate-100">
              <CardHeader>
                <CardTitle className="font-serif">Todas as Matrículas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Escola</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">{enrollment.user_name}</TableCell>
                        <TableCell>{enrollment.school_name}</TableCell>
                        <TableCell>{enrollment.course_name}</TableCell>
                        <TableCell>€{enrollment.price.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                        <TableCell>{new Date(enrollment.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {enrollments.length === 0 && (
                  <p className="text-slate-500 text-center py-8">Nenhuma matrícula</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="border-slate-100">
              <CardHeader>
                <CardTitle className="font-serif">Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.user_email}</TableCell>
                        <TableCell>€{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="font-mono text-xs">{payment.session_id?.slice(0, 20)}...</TableCell>
                        <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {payments.length === 0 && (
                  <p className="text-slate-500 text-center py-8">Nenhum pagamento</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
