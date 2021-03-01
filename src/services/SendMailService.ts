import nodemailer, { Transporter } from 'nodemailer';
import { resolve } from "path";
import fs from "fs";
import handlebars from 'handlebars';
import { Survey } from '../models/Survey';

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });
      this.client = transporter;
    });
  }

  async execute(to: string, subject: string, variables: object, path: string) {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const html = handlebars.compile(templateFileContent)(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html: html,
      from: "NPS <noreply@elycorp.com>"
    });
    console.log('Email ID:', message.messageId);
    console.log('Email URL', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
