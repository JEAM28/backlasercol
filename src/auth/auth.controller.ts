import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from 'src/users/users.dto';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { LoginGoogleAuthGuard } from 'src/guards/login.google.guard';
import { CustomerGoogleAuthGuard } from 'src/guards/register.google.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/register')
  @ApiOperation({
    summary: "Registrar un nuevo usuario",
    description: `
    Esta ruta permite registrar un nuevo usuario en el sistema. 
    Se espera que el cuerpo de la solicitud contenga la información del usuario, 
    incluyendo nombre, email, y contraseña. 
    La contraseña debe confirmarse, pero solo se almacenará una versión limpia del usuario sin el campo de confirmación de contraseña.
    Si el registro es exitoso, se creará una nueva cuenta para el usuario.
    `
  })
  register(@Body() user: CreateUserDTO) {
    const { passwordConfirmation, ...cleanUser } = user;
    return this.authService.register(cleanUser);
  }
  
  @Post('/login')
  @ApiOperation({
    summary: "Iniciar sesión de usuario",
    description: `
    Esta ruta permite a un usuario iniciar sesión en su cuenta. 
    Se espera que el cuerpo de la solicitud contenga las credenciales del usuario, 
    específicamente el email y la contraseña. 
    Si las credenciales son válidas, se generará un token de acceso para el usuario.
    `
  })
  login(@Body() credentials: LoginUserDTO) {
    const { email, password } = credentials;
    return this.authService.login(email, password);
  }

  @Get('api/google/login')
  @UseGuards(LoginGoogleAuthGuard)
  async googleLoginAuth(@Req() req: Request) {}

  @Get('api/callback/google/login')
  @UseGuards(LoginGoogleAuthGuard)
  async googleLoginAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
    if (user !== null && typeof user === 'object' && !Array.isArray(user)) {
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      const token = this.jwtService.sign(payload);
      if (payload.email) res.redirect(`http://localhost:4000/?token=${token}`);
    }
    if (typeof user === 'string') {
      res.redirect(`http://localhost:4000/register?${user}=userDoesNotExist`);
    }
  }

  @Get('api/google/register/customer')
  @UseGuards(CustomerGoogleAuthGuard)
  async googleCustomerAuth(@Req() req: Request) {}

  @Get('api/callback/google/register/customer')
  @UseGuards(CustomerGoogleAuthGuard)
  async googleCustomerAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user: any = req.user;

    if (user !== null && typeof user === 'object' && !Array.isArray(user))
      res.redirect('http://localhost:4000/login');
    if (typeof user === 'string')
      res.redirect(`http://localhost:4000/register?${user}`);
  }
}
