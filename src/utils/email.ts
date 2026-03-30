import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chandanaprabhakar.ckm@gmail.com",
    pass: process.env.GMAIL_PASSWORD!,
  },
});

export async function sendReceiptEmail(data: {
  email: string;
  filePath: string;
}) {
  await transporter.sendMail({
    from: "chandanaprabhakar.2000@gmail.com",
    to: data.email,
    subject: "Payment Receipt",
    text: "Your payment was successful. Receipt attached.",
    attachments: [
      {
        filename: "receipt.pdf",
        path: data.filePath,
      },
    ],
  });

  console.log("Email sent to:", data.email);
}
