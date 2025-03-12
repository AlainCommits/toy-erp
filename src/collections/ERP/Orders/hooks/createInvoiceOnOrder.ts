import type { GlobalAfterChangeHook } from 'payload';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import payload from 'payload';

const createInvoiceOnOrder: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  try {
    // PDF Dokument erstellen
    const pdfDoc = new PDFDocument();
    const fileName = `invoice-${doc.orderNumber}.pdf`;
    const filePath = path.join(process.cwd(), 'uploads', 'documents', fileName);

    // Stream erstellen
    const writeStream = fs.createWriteStream(filePath);
    pdfDoc.pipe(writeStream);

    // PDF Inhalt generieren
    pdfDoc
      .fontSize(20)
      .text('Rechnung', { align: 'center' })
      .moveDown()
      .fontSize(12)
      .text(`Rechnungsnummer: ${doc.orderNumber}`)
      .text(`Datum: ${new Date().toLocaleDateString('de-DE')}`)
      .moveDown()
      .text('Rechnungsadresse:')
      .text(doc.billingAddress.street)
      .text(`${doc.billingAddress.zipCode} ${doc.billingAddress.city}`)
      .text(doc.billingAddress.country)
      .moveDown()
      .text('Bestellpositionen:')
      .moveDown();

    // Bestellpositionen
    doc.orderItems.forEach(item => {
      pdfDoc.text(
        `${item.quantity}x ${item.product.title} à ${item.unitPrice}€ = ${
          item.quantity * item.unitPrice
        }€`
      );
    });

    // Summen
    pdfDoc
      .moveDown()
      .text(`Zwischensumme: ${doc.subtotal}€`)
      .text(`Versandkosten: ${doc.shippingCost}€`);

    if (doc.discount) {
      pdfDoc.text(`Rabatt: ${doc.discount}€`);
    }

    pdfDoc
      .text(`Steuer: ${doc.taxAmount}€`)
      .text(`Gesamtbetrag: ${doc.total}€`);

    // PDF finalisieren
    pdfDoc.end();

    // Warten bis das PDF geschrieben wurde
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
    });

    // Dokument in der Document Collection anlegen
    await payload.create({
      collection: 'documents',
      data: {
        title: `Rechnung - ${doc.orderNumber}`,
        documentType: 'invoice',
        description: `Rechnung für Bestellung ${doc.orderNumber}`,
        relatedEntity: {
          relationTo: 'orders',
          value: doc.id,
        },
        upload: {
          data: fs.readFileSync(filePath),
          filename: fileName,
          mimeType: 'application/pdf',
        },
        createdBy: req.user.id,
      },
    });

  } catch (error) {
    payload.logger.error(`Fehler beim Erstellen der Rechnung für Bestellung ${doc.orderNumber}: ${error}`);
  }

  return doc;
};

export default createInvoiceOnOrder;
