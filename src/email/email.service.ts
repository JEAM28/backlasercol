import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
import { CreateUserDTO } from 'src/users/users.dto';
import * as path from 'path';
import * as fs from 'fs';

dotenvConfig({ path: '../../env' });

console.log(process.env.EMAIL);
console.log(process.env.EMAIL_PASSWORD);
@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 685,
      secure: true,
      auth: {
        user: 'pflasercol@gmail.com',
        pass: 'jdxl kdjc ujmd kfxe',
      },
    });
  }
  async sendMail(to: string, subject: string, text: string, html: string) {
    console.log('Contenido HTML enviado:', html);
    const mailOptions = {
      from: 'pflasercol@gmail.com',
      to: to,
      subject: subject,
      text: text,
      html: html,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('correo enviado: %s', info.messageId);
      return info;
    } catch (error) {
      console.log('Error al enviar correo %s', error);
      throw error;
    }
  }

  async sendWelcomeEmail(customer: CreateUserDTO) {
    const emailTemplatePath = path.join(
      __dirname,
      '../../nodemailer-correo/index.html',
    );

    let htmlTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');
    htmlTemplate = htmlTemplate.replace('[Nombre del Usuario]', customer.name);

    await this.sendMail(
      customer.email,
      'Bienvenido a Lasercol',
      'Gracias por registrarte en nuestra plataforma',
      htmlTemplate,
    );
  }
}
