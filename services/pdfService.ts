
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order as Quote } from '../types';

export const generateQuotePDF = (quote: Quote) => {
  const doc = new jsPDF();
  const filename = `Pedido_Kids_${quote.clientName.replace(/\s+/g, '_')}_${quote.id}.pdf`;

  // Header Temático
  doc.setFillColor(255, 245, 247);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(244, 114, 182); // Pink-400
  doc.setFont('helvetica', 'bold');
  doc.text('Charminho Kids', 14, 22);
  
  doc.setFontSize(9);
  doc.setTextColor(160, 160, 160);
  doc.setFont('helvetica', 'normal');
  doc.text('BOUTIQUE INFANTIL & ACESSÓRIOS', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Data: ${new Date(quote.date).toLocaleDateString('pt-BR')}`, 150, 22);
  doc.text(`Pedido Nº: #${quote.id.toString().padStart(4, '0')}`, 150, 28);

  // Client Info
  doc.setDrawColor(244, 114, 182);
  doc.setLineWidth(0.5);
  doc.line(14, 45, 196, 45);

  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Para a Mamãe/Papai:', 14, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${quote.clientName}`, 14, 62);
  doc.text(`Telefone: ${quote.clientPhone}`, 14, 67);
  doc.text(`E-mail: ${quote.clientEmail}`, 14, 72);

  // Table
  const tableRows = quote.items.map(item => [
    item.productName,
    item.quantity.toString(),
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice),
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice * item.quantity)
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Peça Infantil', 'Qtd', 'V. Unitário', 'Subtotal']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [244, 114, 182], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { font: 'helvetica', fontSize: 9 },
    columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 150;

  // Resumo de Valores e Pagamento
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  
  const summaryX = 140;
  let currentY = finalY + 10;

  // Subtotal
  doc.text('Subtotal:', summaryX, currentY);
  doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.subtotal || quote.total), 196, currentY, { align: 'right' });
  
  // Desconto (se houver)
  if (quote.discountPercentage > 0) {
    currentY += 6;
    doc.setTextColor(244, 114, 182);
    doc.text(`Desconto (${quote.discountPercentage}%):`, summaryX, currentY);
    const discAmt = (quote.subtotal || quote.total) * (quote.discountPercentage / 100);
    doc.text(`- ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discAmt)}`, 196, currentY, { align: 'right' });
  }

  // Total Final
  currentY += 10;
  doc.setFillColor(240, 249, 255);
  doc.rect(summaryX - 5, currentY - 6, 61, 10, 'F');
  doc.setFontSize(12);
  doc.setTextColor(2, 132, 199);
  doc.text('Total Final:', summaryX, currentY);
  doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total), 196, currentY, { align: 'right' });

  // Forma de Pagamento
  currentY += 12;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'bold');
  doc.text(`Forma de Pagamento: ${quote.paymentMethod}`, summaryX, currentY);

  // Observations
  if (quote.observations) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('Mensagem Carinhosa:', 14, finalY + 30);
    doc.setFontSize(9);
    doc.text(quote.observations, 14, finalY + 37, { maxWidth: 120 });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('Charminho Kids - Feito com amor para o seu pequeno.', 105, 285, { align: 'center' });

  doc.save(filename);
};
