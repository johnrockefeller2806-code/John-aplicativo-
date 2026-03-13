# Proposta de Integração - STUFF Intercâmbio + Entrust

## Sobre a Empresa

**Nome:** STUFF Intercâmbio
**Setor:** Educação Internacional / EdTech
**Mercado:** Brasil → Irlanda (Dublin)
**Modelo:** Plataforma B2C que conecta estudantes brasileiros a escolas de inglês na Irlanda

## Descrição do Negócio

O STUFF Intercâmbio é uma plataforma digital que permite estudantes brasileiros:
- Encontrar e comparar escolas de inglês em Dublin
- Realizar matrícula e pagamento online
- Assinar contratos digitalmente
- Receber documentação para visto (carta da escola, passaporte digital)

## Necessidades de Segurança

### 1. Verificação de Identidade (KYC)

**Momento de uso:**
- No primeiro cadastro/login do estudante
- Verificação periódica (semanal) para prevenir compartilhamento de conta

**Requisitos:**
- Verificação facial com prova de vida (liveness detection)
- Comparação com documento de identidade (passaporte brasileiro)
- Detecção de fraude (deepfake, fotos de fotos)
- Anti-spoofing

**Volume estimado:**
- Fase inicial: 100-500 verificações/mês
- Crescimento: 1.000-5.000 verificações/mês (1º ano)
- Escala: 10.000+ verificações/mês (2º ano)

### 2. Assinatura Digital de Contratos

**Documentos a serem assinados:**
- Contrato de prestação de serviços educacionais
- Termos de uso da plataforma
- Aceite de políticas de cancelamento

**Requisitos:**
- Assinatura Eletrônica Qualificada (QES) com validade jurídica
- Registro de IP, data/hora, geolocalização
- Certificado digital associado à verificação de identidade
- Armazenamento seguro dos documentos assinados
- Trilha de auditoria completa

**Volume estimado:**
- 1 contrato por matrícula
- Mesmo volume das verificações de identidade

### 3. Fluxo Desejado

```
ESTUDANTE SE CADASTRA
        ↓
VERIFICAÇÃO FACIAL + DOCUMENTO
(Entrust IDV)
        ↓
SE APROVADO → ACESSO LIBERADO
SE REPROVADO → BLOQUEIO + REVISÃO MANUAL
        ↓
ESTUDANTE ESCOLHE CURSO
        ↓
CONTRATO DIGITAL GERADO
        ↓
ASSINATURA ELETRÔNICA QUALIFICADA
(Entrust QES)
        ↓
PAGAMENTO VIA STRIPE
        ↓
VERIFICAÇÃO FACIAL PERIÓDICA
(Semanal - Entrust IDV)
        ↓
DOCUMENTOS LIBERADOS
(Passaporte Digital + Carta da Escola)
```

## Requisitos Técnicos

### Stack Atual
- **Backend:** Python (FastAPI)
- **Frontend:** React.js
- **Banco de Dados:** MongoDB
- **Hospedagem:** Cloud (Kubernetes)

### Integração Desejada
- API REST ou SDK
- Webhooks para notificações de resultado
- SDK Web para captura facial no navegador
- SDK Mobile (futuro) para iOS/Android

### Compliance Necessário
- LGPD (Brasil)
- GDPR (Europa/Irlanda)
- Validade jurídica de assinaturas no Brasil e Irlanda

## Perguntas para a Entrust

1. **Pacote recomendado:** Qual plano/pacote atende melhor nossas necessidades?

2. **Pricing:** 
   - Modelo de cobrança (por verificação, por usuário, mensal)?
   - Existe plano para startups/scale-ups?
   - Trial/sandbox gratuito para desenvolvimento?

3. **Integração:**
   - Tempo médio de integração?
   - Suporte técnico durante implementação?
   - Documentação e exemplos em Python?

4. **Assinatura Digital:**
   - A assinatura tem validade jurídica no Brasil (ICP-Brasil)?
   - E na Irlanda/Europa (eIDAS)?

5. **SLA:**
   - Disponibilidade garantida?
   - Tempo de resposta das verificações?

## Contato

**Responsável:** [Seu Nome]
**Email:** [Seu Email]
**Telefone:** [Seu Telefone]
**Website:** [URL do STUFF quando lançar]

## Timeline Desejado

- **Semana 1-2:** Receber credenciais de sandbox/trial
- **Semana 2-4:** Integração técnica e testes
- **Semana 4-6:** Testes com usuários beta
- **Semana 6-8:** Lançamento no mercado

---

*Documento preparado para solicitação de demo/proposta comercial*
*STUFF Intercâmbio - Março 2026*
