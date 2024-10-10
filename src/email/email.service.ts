import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
import { CreateUserDTO } from 'src/users/users.dto';
import * as path from 'path';
import * as fs from 'fs';

dotenvConfig({ path: '.env' });

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendWelcomeEmail(user: { name: string; email: string }) {
    const emailTemplatePath = path.join(
      __dirname,
      '../nodemailer-correo/index.html',
    );

    let htmlTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');
    htmlTemplate = htmlTemplate.replace('[Nombre del Usuario]', user.name);

    await this.sendMail(
      user.email,
      'Bienvenido a Lasercol',
      'Gracias por registrarte en nuestra plataforma',
      htmlTemplate,
    );
  }

  async sendMail(to: string, subject: string, text: string, name: string) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: 'Bienvenid@ a nuestra Plataforma',
      text: text,
      html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Verdana, Geneva, Tahoma, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #fff; padding-top: 10px; text-align: center; border-radius: 10px 10px 0 0; display: flex; justify-content: center;">
            <h1 style="margin: 0; font-size: 30px;">LaserCol</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; line-height: 1.5;">Hola ${name}</p>
            <p style="font-size: 16px; line-height: 1.5;">Gracias por registrarte como usuario en nuestra plataforma. Estamos emocionados de tenerte con nosotros. Acá podras ver todos nuestros productos.</p>
            <p style="font-size: 16px; line-height: 1.5;">Para cualquier consulta, no dudes en contactarnos.</p>
        </div>
        <div style="padding: 10px 0; text-align: center; color: #777777; font-size: 12px;">
            <p>Copyright &copy; Todos los derechos reservados. | Hecho con ♥ por el Equipo LaserCol.</p>
        </div>
    </div>
</body>
</html>
`,
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
}
