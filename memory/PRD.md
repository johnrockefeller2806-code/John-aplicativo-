# Dublin Study - Plataforma de Intercâmbio Educacional

## Problema Original
Criação de um aplicativo completo de intercâmbio educacional com foco em Dublin, Irlanda, desenvolvido para conectar estudantes diretamente às escolas credenciadas, sem intermediários.

## Arquitetura
- **Backend**: FastAPI + MongoDB + Stripe (emergentintegrations)
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Auth**: JWT (email/senha) com 3 roles: student, school, admin
- **Payments**: Stripe (test mode)
- **Emails**: MOCKED (logged to console)

## User Personas
1. **Estudante Brasileiro** - Quer estudar inglês em Dublin
2. **Escola de Inglês** - Quer cadastrar cursos e receber matrículas
3. **Administrador** - Gerencia a plataforma, aprova escolas

## Core Requirements (Static)
- Catálogo de escolas com preços transparentes
- Cursos com duração, carga horária e requisitos
- Pagamento online integrado (Stripe)
- Notificação automática por e-mail após pagamento
- Guias de transporte público de Dublin
- Lista de órgãos governamentais
- Guia PPS Number, GNIB/IRP, Passaporte
- Interface multilíngue (PT/EN)
- Painel Admin para gerenciamento
- Área da Escola para gestão de cursos

## Implementado - Janeiro 2025

### Fase 1 - MVP Estudante ✅
- Catálogo de escolas e cursos
- Fluxo de matrícula + pagamento Stripe
- Dashboard do estudante
- Guias (PPS, GNIB, Passaporte)
- Transporte público Dublin
- Interface bilíngue PT/EN

### Fase 2 - Admin + Escola ✅
- **Painel Admin** (/admin)
  - Dashboard com estatísticas
  - Aprovar/rejeitar escolas
  - Ver todos usuários
  - Ver todas matrículas
  - Ver todos pagamentos
  
- **Área da Escola** (/school)
  - Dashboard com estatísticas
  - CRUD de cursos
  - Ver matrículas recebidas
  - Enviar carta de aceitação
  - Perfil da escola

- **Registro de Escola** (/register-school)
  - Cadastro de nova escola
  - Status pendente até aprovação admin

### Fase 3 - Branding & Suporte ✅ (Janeiro 2026)
- **Logo STUFF Intercâmbio** aplicada em todo o app
  - Navbar (todas as páginas)
  - Hero section (Landing page)
  - Páginas de Login e Register
  - Página STUFF Dúvidas
  
- **Página STUFF Dúvidas** (/duvidas)
  - FAQ organizado por categorias (5 categorias, 15+ perguntas)
  - Formulário de contato funcional
  - Endpoint POST /api/contact
  - Mensagens armazenadas no MongoDB
  
- **Guia Carteira de Motorista Irlandesa**
  - Processo completo de obtenção
  - Link para NDLS (https://www.ndls.ie)

### Fase 4 - Chat Comunidade ✅ (Janeiro 2026)
- **Chat em Tempo Real** (/chat) - Comunidade STUFF
  - WebSocket para mensagens em tempo real
  - Grupo geral para todos os usuários logados
  - Suporte a texto + emojis (emoji-picker-react)
  - Histórico de mensagens com auto-delete após 2 dias (MongoDB TTL)
  - Indicador de usuários online
  - Status de conexão (Conectado/Desconectado)
  - Notificações do navegador para novas mensagens
  
- **Moderação (Admin)**
  - Deletar mensagens
  - Banir usuários temporariamente (24h padrão)
  - Ver lista de usuários banidos
  - Desbanir usuários

- **Endpoints Chat (8 novos)**
  - WebSocket: /api/chat/ws
  - GET /api/chat/messages
  - GET /api/chat/online
  - GET /api/chat/ban-status
  - DELETE /api/chat/messages/{id}
  - POST /api/chat/ban
  - DELETE /api/chat/ban/{user_id}
  - GET /api/chat/bans

### Fase 5 - Stripe Connect para Escolas ✅ (Janeiro 2026)
- **Planos de Assinatura** (/school/subscription)
  - Starter: €49/mês + 8% comissão
  - Professional: €99/mês + 5% comissão (POPULAR)
  - Premium: €199/mês + 3% comissão
  
- **Funcionalidades**
  - Página de planos com comparação visual
  - Checkout via Stripe (modo teste)
  - Dashboard de ganhos com breakdown mensal
  - Status de assinatura no painel da escola
  
- **Endpoints Stripe Connect (6 novos)**
  - GET /api/school/subscription/plans (público)
  - POST /api/school/subscription/subscribe
  - GET /api/school/subscription/status/{session_id}
  - GET /api/school/subscription
  - GET /api/school/earnings

### Credenciais de Teste
- **Admin**: admin@dublinstudy.com / admin123

### Backend Endpoints (49 total)
- Auth: register, register-school, login, me
- Schools: list, detail, courses (public)
- Courses: list, detail
- Enrollments: create, list, detail
- Payments: checkout, status, webhook
- Transport: routes
- Services: agencies
- Guides: pps, gnib, passport, driving-license
- Admin: stats, schools, users, enrollments, payments, approve/reject
- School: dashboard, profile, courses CRUD, enrollments, send-letter
- Contact: form submission
- Chat: ws, messages, online, ban-status, delete, ban, unban, bans
- **Stripe Connect: plans, subscribe, status, subscription, earnings** (NEW)
- Seed

## Prioritized Backlog

### P0 - Próximos Passos
- [ ] Integração real de e-mail (SendGrid/Resend) - substituir mock
- [x] ~~Stripe Connect (pagamento direto para escola + comissão)~~ → Implementado

### P1 - Importante
- [ ] Upload de carta PDF (não apenas URL)
- [ ] Edição de perfil da escola (imagem, facilities)
- [ ] Sistema de reviews/avaliações
- [ ] Notificações push
- [x] ~~Chat de suporte integrado~~ → Implementado como Comunidade STUFF

### P2 - Nice to Have
- [ ] Tela de splash com logo STUFF
- [ ] Página "Sobre" institucional
- [ ] Calculadora de custos de vida
- [ ] Novos guias (Revenue, aluguel de imóveis)
- [ ] Seção de depoimentos de estudantes
- [ ] PWA mobile
- [ ] Blog/artigos
- [ ] Mensagens privadas no chat (DM)
- [ ] Grupos de chat por escola/curso
- [ ] Login com SMS/OTP (como WhatsApp)

## Tecnologias
- FastAPI 0.110.1
- React 19
- MongoDB (motor)
- Stripe (emergentintegrations)
- Tailwind CSS 3.4
- Shadcn UI
- lucide-react icons
- **WebSockets (FastAPI native)** - para chat em tempo real
- **emoji-picker-react** - seletor de emojis
