import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateReceiptPDF(data: {
  transactionId: string;
  amount: number;
  currency: string;
  email: string;
}): Promise<string> {
  const fileName = `receipt-${data.transactionId}.pdf`;
  const filePath = path.join("receipts", fileName);

  if (!fs.existsSync("receipts")) {
    fs.mkdirSync("receipts");
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text("Payment Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Transaction ID: ${data.transactionId}`);
    doc.text(`Amount: ${data.amount / 100} ${data.currency.toUpperCase()}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Date: ${new Date().toISOString()}`);

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}
