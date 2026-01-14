import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { 
  HelpCircle, 
  MessageCircle, 
  Send, 
  CheckCircle,
  GraduationCap,
  CreditCard,
  FileText,
  Plane,
  Home,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";
const HERO_IMAGE_URL = "https://customer-assets.emergentagent.com/job_dublin-exchange/artifacts/498i1soq_WhatsApp%20Image%202026-01-12%20at%2000.30.29.jpeg";

export const StuffDuvidas = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      category: language === 'pt' ? 'Sobre o Intercâmbio' : 'About Exchange',
      icon: GraduationCap,
      questions: [
        {
          q: language === 'pt' ? 'Quanto tempo dura um intercâmbio na Irlanda?' : 'How long does an exchange in Ireland last?',
          a: language === 'pt' 
            ? 'Os cursos variam de 8 a 25 semanas. O mais comum é o curso de 25 semanas, que permite trabalhar meio período (20h/semana durante aulas, 40h nas férias).'
            : 'Courses range from 8 to 25 weeks. The most common is the 25-week course, which allows part-time work (20h/week during classes, 40h during holidays).'
        },
        {
          q: language === 'pt' ? 'Preciso saber inglês para fazer intercâmbio?' : 'Do I need to know English to exchange?',
          a: language === 'pt'
            ? 'Não! As escolas aceitam alunos de todos os níveis, desde iniciante até avançado. Você fará um teste de nivelamento no primeiro dia.'
            : 'No! Schools accept students of all levels, from beginner to advanced. You will take a placement test on the first day.'
        },
        {
          q: language === 'pt' ? 'Qual a diferença entre a STUFF e uma agência tradicional?' : 'What is the difference between STUFF and a traditional agency?',
          a: language === 'pt'
            ? 'Na STUFF, você fala diretamente com a escola, sem intermediários. Isso significa preços mais baixos, transparência total e comunicação direta. Não cobramos comissões escondidas.'
            : 'At STUFF, you talk directly to the school, without intermediaries. This means lower prices, full transparency and direct communication. We do not charge hidden commissions.'
        }
      ]
    },
    {
      category: language === 'pt' ? 'Pagamento e Matrícula' : 'Payment and Enrollment',
      icon: CreditCard,
      questions: [
        {
          q: language === 'pt' ? 'Como funciona o pagamento?' : 'How does payment work?',
          a: language === 'pt'
            ? 'O pagamento é feito 100% online, de forma segura via Stripe. Você pode pagar com cartão de crédito internacional. Após a confirmação, você recebe um e-mail imediatamente.'
            : 'Payment is 100% online, securely via Stripe. You can pay with an international credit card. After confirmation, you receive an email immediately.'
        },
        {
          q: language === 'pt' ? 'Em quanto tempo recebo a carta da escola?' : 'How long does it take to receive the school letter?',
          a: language === 'pt'
            ? 'Após a confirmação do pagamento, a escola envia a carta oficial em até 5 dias úteis. Esta carta é necessária para seu processo de visto.'
            : 'After payment confirmation, the school sends the official letter within 5 business days. This letter is required for your visa process.'
        },
        {
          q: language === 'pt' ? 'Posso parcelar o pagamento?' : 'Can I pay in installments?',
          a: language === 'pt'
            ? 'O parcelamento depende do seu cartão de crédito. Algumas bandeiras oferecem parcelamento automático. Também aceitamos pagamento em duas parcelas em casos especiais.'
            : 'Installment payment depends on your credit card. Some brands offer automatic installments. We also accept payment in two installments in special cases.'
        }
      ]
    },
    {
      category: language === 'pt' ? 'Documentação' : 'Documentation',
      icon: FileText,
      questions: [
        {
          q: language === 'pt' ? 'Preciso de visto para estudar na Irlanda?' : 'Do I need a visa to study in Ireland?',
          a: language === 'pt'
            ? 'Brasileiros não necessitam de visto para entrar na Irlanda como turista, com prazo máximo de 90 dias de permanência. Para permanecer por um período maior, é necessário realizar um intercâmbio seguindo as regras da imigração irlandesa.'
            : 'Brazilians do not need a visa to enter Ireland as tourists, with a maximum stay of 90 days. To stay for a longer period, it is necessary to enroll in an exchange program following Irish immigration rules.'
        },
        {
          q: language === 'pt' ? 'O que é o GNIB/IRP?' : 'What is GNIB/IRP?',
          a: language === 'pt'
            ? 'É o registro de imigração obrigatório para estudantes não-europeus. Você precisa agendar no site do INIS e comparecer com seus documentos. O custo é €300.'
            : 'It is the mandatory immigration registration for non-European students. You need to book on the INIS website and attend with your documents. The cost is €300.'
        },
        {
          q: language === 'pt' ? 'O que é o PPS Number?' : 'What is the PPS Number?',
          a: language === 'pt'
            ? 'É como o CPF irlandês. Você precisa dele para trabalhar legalmente e para algumas questões fiscais. O processo é gratuito e você agenda online.'
            : 'It is like the Irish CPF. You need it to work legally and for some tax matters. The process is free and you book online.'
        }
      ]
    },
    {
      category: language === 'pt' ? '🛂 Turista → Estudante' : '🛂 Tourist → Student',
      icon: Plane,
      questions: [
        {
          q: language === 'pt' ? 'Posso mudar de turista para estudante estando na Irlanda?' : 'Can I change from tourist to student while in Ireland?',
          a: language === 'pt'
            ? '❌ Não é permitido mudar automaticamente seu status de turista para visto de estudante estando na Irlanda. Segundo as regras de imigração irlandesas, entrar como turista com a intenção de depois pedir visto de estudante não é aceito pelas autoridades. A mudança de status geralmente exige que você solicite o visto fora do país.'
            : '❌ It is not allowed to automatically change your status from tourist to student visa while in Ireland. According to Irish immigration rules, entering as a tourist with the intention of later applying for a student visa is not accepted by authorities. Changing status usually requires you to apply for the visa outside the country.'
        },
        {
          q: language === 'pt' ? 'O que é o visto de estudante (Stamp 2)?' : 'What is the student visa (Stamp 2)?',
          a: language === 'pt'
            ? '🎓 O Stamp 2 é a permissão de residência para estudantes na Irlanda. Com ele você pode: estudar em tempo integral em instituição reconhecida, trabalhar até 20h/semana durante aulas e 40h nas férias, permanecer legalmente no país durante seu curso. Para cursos de inglês longos, geralmente é necessário estudar no mínimo 25 semanas.'
            : '🎓 Stamp 2 is the residence permit for students in Ireland. With it you can: study full-time at a recognized institution, work up to 20h/week during classes and 40h during holidays, stay legally in the country during your course. For long English courses, you usually need to study at least 25 weeks.'
        },
        {
          q: language === 'pt' ? 'Quais documentos preciso para o visto de estudante?' : 'What documents do I need for the student visa?',
          a: language === 'pt'
            ? '📄 Documentos essenciais:\n• Carta de aceitação da escola\n• Comprovante de pagamento do curso\n• Seguro saúde válido\n• Prova de recursos financeiros suficientes\n• Comprovante de acomodação\n• Passaporte válido\n• Intenção clara de estudo'
            : '📄 Essential documents:\n• School acceptance letter\n• Proof of course payment\n• Valid health insurance\n• Proof of sufficient financial resources\n• Proof of accommodation\n• Valid passport\n• Clear intention to study'
        },
        {
          q: language === 'pt' ? 'Estou como turista na Irlanda. Como me organizar?' : 'I am a tourist in Ireland. How do I organize myself?',
          a: language === 'pt'
            ? '✈️ Se você já está na Irlanda como turista e quer estudar, uma alternativa comum é:\n\n1. Organizar toda a documentação (escola, pagamento, seguro, comprovação financeira)\n2. Sair temporariamente da Irlanda para um país próximo da Europa\n3. Realizar o processo de entrada novamente seguindo as regras de imigração\n4. Retornar à Irlanda já com o objetivo correto de estudo\n\n📌 Países próximos costumam ter passagens mais baratas, tornando o processo mais acessível. A decisão final sempre é da imigração no momento da entrada.'
            : '✈️ If you are already in Ireland as a tourist and want to study, a common alternative is:\n\n1. Organize all documentation (school, payment, insurance, financial proof)\n2. Temporarily leave Ireland for a nearby European country\n3. Go through the entry process again following immigration rules\n4. Return to Ireland with the correct purpose of study\n\n📌 Nearby countries usually have cheaper flights, making the process more accessible. The final decision is always made by immigration at the time of entry.'
        },
        {
          q: language === 'pt' ? 'Quais as vantagens de se organizar corretamente?' : 'What are the advantages of organizing correctly?',
          a: language === 'pt'
            ? '✅ Vantagens de seguir o processo correto:\n\n• Processo mais rápido e organizado\n• Menor custo do que retornar ao país de origem\n• Planejamento adequado\n• Respeito às regras imigratórias\n• Mais segurança na tomada de decisão\n• Evita problemas futuros com imigração'
            : '✅ Advantages of following the correct process:\n\n• Faster and more organized process\n• Lower cost than returning to your home country\n• Proper planning\n• Respect for immigration rules\n• More security in decision making\n• Avoids future problems with immigration'
        },
        {
          q: language === 'pt' ? 'O que acontece se eu ficar além do tempo permitido?' : 'What happens if I stay beyond the allowed time?',
          a: language === 'pt'
            ? '⚠️ Tentar permanecer no país além do tempo permitido ou sem o visto correto pode levar a consequências graves:\n\n• Deportação\n• Proibição de reentrada na Irlanda\n• Problemas em futuros pedidos de visto\n• Dificuldades para entrar em outros países\n\nPor isso, é essencial seguir as regras de imigração e fazer o processo corretamente com antecedência.'
            : '⚠️ Trying to stay in the country beyond the allowed time or without the correct visa can lead to serious consequences:\n\n• Deportation\n• Ban on re-entry to Ireland\n• Problems with future visa applications\n• Difficulties entering other countries\n\nTherefore, it is essential to follow immigration rules and complete the process correctly in advance.'
        },
        {
          q: language === 'pt' ? 'Posso estender minha permanência como turista?' : 'Can I extend my stay as a tourist?',
          a: language === 'pt'
            ? '📅 Existe uma possibilidade de extensão da permissão de visitante, mas apenas em circunstâncias específicas (como doença ou evento imprevisto). Isso não é garantido e é avaliado caso a caso pelo Irish Immigration Service.\n\n❌ Esta extensão NÃO é válida para quem deseja iniciar estudos regulares - para isso, é necessário obter o visto de estudante (Stamp 2) seguindo o processo correto.'
            : '📅 There is a possibility of extending visitor permission, but only in specific circumstances (such as illness or unforeseen event). This is not guaranteed and is evaluated on a case-by-case basis by the Irish Immigration Service.\n\n❌ This extension is NOT valid for those who wish to start regular studies - for this, you need to obtain the student visa (Stamp 2) following the correct process.'
        }
      ]
    },
    {
      category: language === 'pt' ? 'Vida na Irlanda' : 'Life in Ireland',
      icon: Home,
      questions: [
        {
          q: language === 'pt' ? 'Quanto custa viver em Dublin?' : 'How much does it cost to live in Dublin?',
          a: language === 'pt'
            ? 'O custo médio mensal é de €800-1200, incluindo acomodação compartilhada (€400-700), alimentação (€200-300), transporte (€100) e lazer (€100-200).'
            : 'The average monthly cost is €800-1200, including shared accommodation (€400-700), food (€200-300), transport (€100) and leisure (€100-200).'
        },
        {
          q: language === 'pt' ? 'Posso trabalhar enquanto estudo?' : 'Can I work while studying?',
          a: language === 'pt'
            ? 'Sim! Com o visto de estudante (Stamp 2), você pode trabalhar 20 horas por semana durante as aulas e 40 horas nas férias (junho-setembro e dezembro-janeiro).'
            : 'Yes! With the student visa (Stamp 2), you can work 20 hours per week during classes and 40 hours during holidays (June-September and December-January).'
        },
        {
          q: language === 'pt' ? 'Como é o clima na Irlanda?' : 'What is the weather like in Ireland?',
          a: language === 'pt'
            ? 'O clima é temperado oceânico. Espere chuva frequente, temperaturas entre 5-20°C e pouca neve. Traga casacos impermeáveis e roupas em camadas!'
            : 'The climate is oceanic temperate. Expect frequent rain, temperatures between 5-20°C and little snow. Bring waterproof coats and layered clothing!'
        }
      ]
    },
    {
      category: language === 'pt' ? 'Trabalho' : 'Work',
      icon: Briefcase,
      questions: [
        {
          q: language === 'pt' ? 'É fácil encontrar trabalho em Dublin?' : 'Is it easy to find work in Dublin?',
          a: language === 'pt'
            ? 'Dublin tem muitas oportunidades, especialmente em hospitalidade, varejo e tecnologia. O salário mínimo é €12.70/hora. Ter inglês intermediário ajuda muito.'
            : 'Dublin has many opportunities, especially in hospitality, retail and technology. The minimum wage is €12.70/hour. Having intermediate English helps a lot.'
        },
        {
          q: language === 'pt' ? 'Preciso de currículo em inglês?' : 'Do I need a resume in English?',
          a: language === 'pt'
            ? 'Sim! Prepare um CV no formato irlandês (sem foto, 1-2 páginas). Muitas escolas oferecem workshops de CV gratuitos para ajudar os alunos.'
            : 'Yes! Prepare a CV in Irish format (no photo, 1-2 pages). Many schools offer free CV workshops to help students.'
        }
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setSubmitted(true);
      toast.success(language === 'pt' ? 'Mensagem enviada com sucesso!' : 'Message sent successfully!');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(language === 'pt' ? 'Erro ao enviar mensagem. Tente novamente.' : 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="duvidas-page">
      {/* Header with Logo Only */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col items-center text-center">
            <img 
              src={LOGO_URL} 
              alt="STUFF Intercâmbio" 
              className="h-24 md:h-32 w-auto object-contain bg-white rounded-2xl p-3 shadow-xl mb-6"
              data-testid="duvidas-logo"
            />
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl">
              {language === 'pt' ? 'Tire todas as suas dúvidas sobre intercâmbio' : 'Get all your exchange questions answered'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-2">
                {language === 'pt' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-slate-500">
                {language === 'pt' 
                  ? 'Encontre respostas para as dúvidas mais comuns sobre intercâmbio na Irlanda'
                  : 'Find answers to the most common questions about exchange in Ireland'}
              </p>
            </div>

            {faqs.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="border-slate-100">
                <CardHeader className="pb-2">
                  <CardTitle className="font-serif flex items-center gap-2 text-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <section.icon className="h-5 w-5 text-blue-700" />
                    </div>
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {section.questions.map((item, index) => (
                      <AccordionItem key={index} value={`item-${sectionIndex}-${index}`}>
                        <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 text-sm">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-slate-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    {language === 'pt' ? 'Não encontrou sua dúvida?' : "Didn't find your question?"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        {language === 'pt' ? 'Mensagem Enviada!' : 'Message Sent!'}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4">
                        {language === 'pt' 
                          ? 'Responderemos em até 24 horas úteis.'
                          : 'We will respond within 24 business hours.'}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', email: '', subject: '', message: '' });
                        }}
                      >
                        {language === 'pt' ? 'Enviar outra mensagem' : 'Send another message'}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{language === 'pt' ? 'Nome' : 'Name'}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-10"
                          data-testid="contact-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-10"
                          data-testid="contact-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{language === 'pt' ? 'Assunto' : 'Subject'}</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="h-10"
                          data-testid="contact-subject"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{language === 'pt' ? 'Mensagem' : 'Message'}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          data-testid="contact-message"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-500"
                        disabled={loading}
                        data-testid="contact-submit"
                      >
                        {loading ? (
                          language === 'pt' ? 'Enviando...' : 'Sending...'
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {language === 'pt' ? 'Enviar Mensagem' : 'Send Message'}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="border-slate-100 mt-4">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500 mb-2">
                    {language === 'pt' ? 'Precisa de ajuda urgente?' : 'Need urgent help?'}
                  </p>
                  <a 
                    href="mailto:contato@stuffintercambio.com"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    contato@stuffintercambio.com
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
