import { getBrowser } from "../utils/puppeteer";
import { generateReceiptHTML } from "../templates/receipt.template";
import { ReceiptJobData } from "../types/receipt.types.ts";

export class ReceiptService {
  async generateAndUpload(data: ReceiptJobData) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      const html = generateReceiptHTML(data);
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      const key = `receipt/${data.paymentIntentId}.pdf`;

      return key;
    } finally {
      await page.close();
    }
  }
}
