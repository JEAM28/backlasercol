import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('mail')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post(':send')
  @ApiOperation({
    summary: "Enviar un correo electrónico personalizado",
    description: `
      Esta ruta permite enviar un correo electrónico a un destinatario especificado, con los detalles del asunto, texto y contenido HTML proporcionados. 
      Es útil para enviar correos personalizados como bienvenidas o notificaciones a los usuarios. Los parámetros 'to', 'subject', 'text' y 'html' deben ser incluidos en el cuerpo de la solicitud.
    `,
  })
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('name') html: string,
  ) {
    return await this.emailService.sendMail(to, subject, text, html);
  }
}
