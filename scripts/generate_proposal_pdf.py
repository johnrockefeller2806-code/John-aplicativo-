from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime

def create_business_proposal():
    # Create the PDF document
    doc = SimpleDocTemplate(
        "/app/STUFF_Proposta_Comercial_Escolas.pdf",
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#065f46'),
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=20,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#6b7280')
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceBefore=20,
        spaceAfter=10,
        textColor=colors.HexColor('#065f46'),
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=12,
        alignment=TA_JUSTIFY,
        leading=16
    )
    
    highlight_style = ParagraphStyle(
        'Highlight',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=12,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#065f46'),
        fontName='Helvetica-Bold'
    )
    
    # Content
    story = []
    
    # Header
    story.append(Paragraph("🇮🇪 STUFF INTERCÂMBIO", title_style))
    story.append(Paragraph("Proposta Comercial para Escolas Parceiras", subtitle_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Line
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#10b981'), spaceBefore=10, spaceAfter=20))
    
    # Introduction
    story.append(Paragraph("📋 SOBRE O STUFF", heading_style))
    story.append(Paragraph(
        "O STUFF Intercâmbio é uma plataforma digital criada por estudantes brasileiros na Irlanda, "
        "com o objetivo de conectar estudantes brasileiros às melhores escolas de inglês do país. "
        "Nossa plataforma oferece informações confiáveis, guias práticos e facilita o processo de "
        "matrícula para milhares de estudantes que chegam à Irlanda todos os anos.",
        body_style
    ))
    story.append(Spacer(1, 0.2*inch))
    
    # Why Partner
    story.append(Paragraph("🤝 POR QUE SER PARCEIRO STUFF?", heading_style))
    
    benefits_data = [
        ['Benefício', 'Descrição'],
        ['✅ Visibilidade', 'Sua escola exposta para milhares de estudantes brasileiros'],
        ['✅ Credibilidade', 'Selo de escola verificada e recomendada'],
        ['✅ Sem Risco', 'Você só paga quando vender - sem mensalidades fixas'],
        ['✅ Suporte', 'Ajudamos estudantes com dúvidas sobre sua escola'],
        ['✅ Marketing', 'Divulgação em nossas redes e plataforma'],
        ['✅ Tecnologia', 'Sistema de matrícula e pagamento integrado'],
    ]
    
    benefits_table = Table(benefits_data, colWidths=[3*cm, 12*cm])
    benefits_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#065f46')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0fdf4')),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#d1fae5')),
    ]))
    story.append(benefits_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Business Model
    story.append(Paragraph("💰 MODELO DE PARCERIA", heading_style))
    story.append(Paragraph(
        "Nosso modelo é simples e justo: <b>você só paga quando vender</b>. "
        "Não cobramos mensalidades fixas nem taxas de adesão. "
        "Trabalhamos com uma pequena comissão sobre cada matrícula realizada através da plataforma.",
        body_style
    ))
    story.append(Spacer(1, 0.1*inch))
    
    # Commission Table
    commission_data = [
        ['Tipo de Parceria', 'Comissão', 'Observação'],
        ['🌟 Parceiro Fundador', '0%', 'Primeiras 5 escolas - GRÁTIS'],
        ['🤝 Parceiro Oficial', '5%', 'Comissão padrão por matrícula'],
        ['📈 Alto Volume', '3%', 'Para escolas com +50 matrículas/mês'],
    ]
    
    commission_table = Table(commission_data, colWidths=[5*cm, 3*cm, 7*cm])
    commission_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#065f46')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#fef3c7')),
        ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#f0fdf4')),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#ede9fe')),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ]))
    story.append(commission_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Example
    story.append(Paragraph("📊 EXEMPLO PRÁTICO", heading_style))
    story.append(Paragraph(
        "Veja como funciona na prática para um curso de <b>€3.000</b>:",
        body_style
    ))
    
    example_data = [
        ['Descrição', 'Valor'],
        ['Valor do Curso', '€3.000,00'],
        ['Comissão STUFF (5%)', '€150,00'],
        ['Sua Escola Recebe', '€2.850,00'],
    ]
    
    example_table = Table(example_data, colWidths=[10*cm, 5*cm])
    example_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6366f1')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, 1), (-1, 2), colors.white),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#d1fae5')),
        ('TEXTCOLOR', (0, 3), (-1, 3), colors.HexColor('#065f46')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ]))
    story.append(example_table)
    story.append(Spacer(1, 0.3*inch))
    
    # How it works
    story.append(Paragraph("🔄 COMO FUNCIONA", heading_style))
    
    steps_data = [
        ['Etapa', 'Descrição'],
        ['1️⃣', 'Escola se cadastra na plataforma STUFF'],
        ['2️⃣', 'Equipe STUFF aprova e verifica a escola'],
        ['3️⃣', 'Escola configura seus cursos e preços'],
        ['4️⃣', 'Estudantes visualizam e se matriculam'],
        ['5️⃣', 'Pagamento processado via Stripe (seguro)'],
        ['6️⃣', 'Escola recebe o valor automaticamente'],
    ]
    
    steps_table = Table(steps_data, colWidths=[2*cm, 13*cm])
    steps_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#065f46')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f9fafb')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ]))
    story.append(steps_table)
    story.append(Spacer(1, 0.3*inch))
    
    # What we offer
    story.append(Paragraph("🎁 O QUE OFERECEMOS", heading_style))
    
    offer_data = [
        ['Para a Escola', 'Para os Estudantes'],
        ['• Página exclusiva da escola', '• Informações verificadas'],
        ['• Gerenciamento de cursos', '• Processo de matrícula fácil'],
        ['• Dashboard de matrículas', '• Pagamento seguro'],
        ['• Relatórios financeiros', '• Suporte em português'],
        ['• Suporte dedicado', '• Guias e orientações'],
        ['• Divulgação na plataforma', '• Comunidade brasileira'],
    ]
    
    offer_table = Table(offer_data, colWidths=[7.5*cm, 7.5*cm])
    offer_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#065f46')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#f0fdf4')),
        ('BACKGROUND', (1, 1), (1, -1), colors.HexColor('#eff6ff')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ]))
    story.append(offer_table)
    story.append(Spacer(1, 0.4*inch))
    
    # CTA
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#10b981'), spaceBefore=10, spaceAfter=20))
    
    story.append(Paragraph("🚀 SEJA UM PARCEIRO STUFF!", highlight_style))
    story.append(Paragraph(
        "Entre em contato conosco para iniciar a parceria. "
        "As primeiras 5 escolas terão <b>comissão ZERO</b> como parceiros fundadores!",
        body_style
    ))
    story.append(Spacer(1, 0.2*inch))
    
    # Contact
    contact_data = [
        ['📧 Email', 'contato@stuffintercambio.com'],
        ['📱 WhatsApp', '+353 XX XXX XXXX'],
        ['🌐 Website', 'www.stuffintercambio.com'],
        ['👤 Fundador', 'John Weslley'],
    ]
    
    contact_table = Table(contact_data, colWidths=[4*cm, 11*cm])
    contact_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#065f46')),
    ]))
    story.append(contact_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Footer
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#d1d5db'), spaceBefore=20, spaceAfter=10))
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#9ca3af')
    )
    story.append(Paragraph(
        f"STUFF Intercâmbio © 2025 - Feito por estudantes brasileiros, para estudantes brasileiros 🇧🇷🇮🇪",
        footer_style
    ))
    story.append(Paragraph(
        f"Documento gerado em {datetime.now().strftime('%d/%m/%Y')}",
        footer_style
    ))
    
    # Build PDF
    doc.build(story)
    print("PDF criado com sucesso!")

if __name__ == "__main__":
    create_business_proposal()
