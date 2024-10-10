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
import { EmailService } from 'src/email/email.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { CartService } from 'src/cart/cart.service';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly cartService: CartService,
  ) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: `Esta ruta permite registrar un nuevo usuario en el sistema. 
    Se espera que el cuerpo de la solicitud contenga la información del usuario, 
    incluyendo nombre, email, y contraseña. 
    La contraseña debe confirmarse, pero solo se almacenará una versión limpia del usuario sin el campo de confirmación de contraseña.
    Si el registro es exitoso, se creará una nueva cuenta para el usuario.`,
  })
  async register(@Body() user: CreateUserDTO) {
    const { passwordConfirmation, ...cleanUser } = user;

    const newUser = await this.authService.register(cleanUser);

    await this.emailService.sendMail(
      user.email,
      'Bienvenido a Lasercol',
      'Gracias por registrarte en nuestra plataforma',
      user.name,
    );
    return newUser;
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Iniciar sesión de usuario',
    description: `Esta ruta permite a un usuario iniciar sesión en su cuenta. 
    Se espera que el cuerpo de la solicitud contenga las credenciales del usuario, 
    específicamente el email y la contraseña. 
    Si las credenciales son válidas, se generará un token de acceso para el usuario.`,
  })
  async login(@Body() credentials: LoginUserDTO) {
    const { email, password } = credentials;
    return await this.authService.login(email, password);
  }

  @Get('api/google/login')
  @UseGuards(AuthGuard('google-login'))
  async googleLoginAuth(@Req() req: Request) {}

  @Get('api/callback/google/login')
  @UseGuards(AuthGuard('google-login'))
  async googleLoginAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user: any = req.user;

    if (user && typeof user === 'object') {
      const payload = { id: user.id, name: user.name, email: user.email };
      const token = this.jwtService.sign(payload);
      // const sessionInfo = payload
      // sessionInfo["token"] = token;

      // res.cookie('userInfo', JSON.stringify(sessionInfo), { httpOnly: false, secure:true, sameSite:'none' });
      res.redirect(`https://lasercol.vercel.app/?token=${token}`);
    } else {
      res.redirect(`https://lasercol.vercel.app/register?user=DoesNotExist`);
    }
  }

  @Get('api/google/register/customer')
  @UseGuards(AuthGuard('google-register'))
  async googleCustomerAuth(@Req() req: Request) {}

  @Get('api/callback/google/register/customer')
  @UseGuards(AuthGuard('google-register'))
  async googleCustomerAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
    let userFound = null;

    if (user && typeof user === 'object') {

      userFound = await this.usersService.getUserByEmail(user.email);

      if (userFound) {
        this.cartService.createCart(userFound.id);

        await this.emailService.sendMail(
          user.email,
          'Bienvenido a Lasercol',
          'Gracias por registrarte en nuestra plataforma',
          user.name,
        );

        res.redirect('https://lasercol.vercel.app/login');
      } else {
        res.redirect(`https://lasercol.vercel.app/register?error=userExists`);
      }
    }
    return userFound;
  }
}