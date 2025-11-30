import nodemailer from "nodemailer";
import fs from "fs";

  export async function sendEmail(options) {
    const {
      to = [],
      cc = [],
      bcc = [],
      subject = "",
      body = "",
      bodyIsHTML = false,
      attachments = [],
    } = options;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM;

    if (!host || !port || !user || !pass || !from) {
      throw new Error("Missing SMTP environment configuration");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    // Attachments processing
    const mailAttachments = attachments.map((filePath) => {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Attachment not found: ${filePath}`);
      }
      return { path: filePath };
    });

  const mailOptions = {
    from,
    to,
    cc: Array.isArray(cc) ? cc.join(", ") : cc,
    bcc: Array.isArray(bcc) ? bcc.join(", ") : bcc,
    subject,
    html: bodyIsHTML ? body : undefined,
    text: !bodyIsHTML ? body : undefined,
    attachments: mailAttachments.length > 0 ? mailAttachments : undefined,
  };


    await transporter.sendMail(mailOptions);
  }
