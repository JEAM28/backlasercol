import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('mail')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post(':send')
  // @UseGuards(AuthGuard)
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('name') html: string,
  ) {
    return await this.emailService.sendMail(to, subject, text, html);
  }
}
