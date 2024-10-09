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
    description: `
      Esta ruta permite registrar un nuevo usuario en el sistema. 
      Se espera que el cuerpo de la solicitud contenga la información del usuario, 
      incluyendo nombre, email y contraseña. Además, se debe enviar la confirmación de la contraseña. 
      Durante el proceso, se verifica que ambas contraseñas coincidan. 
      Si el registro es exitoso, se almacenará la información del usuario (excluyendo la confirmación de contraseña) 
      y se enviará un correo de bienvenida. 
      El usuario registrado podrá iniciar sesión posteriormente.`,
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
    description: `
      Esta ruta permite a los usuarios registrados iniciar sesión en su cuenta proporcionando su correo electrónico y contraseña. 
      Si las credenciales proporcionadas son correctas, se generará y devolverá un token JWT que permitirá al usuario acceder a recursos protegidos.`,
  })
  async login(@Body() credentials: LoginUserDTO) {
    const { email, password } = credentials;
    return await this.authService.login(email, password);
  }

  @Get('api/google/login')
  @ApiOperation({
    summary: 'Inicio de sesión con Google',
    description: `
      Esta ruta redirige al usuario al proceso de autenticación de Google para iniciar sesión en la plataforma. 
      Utiliza un guardián (GoogleAuthGuard) para manejar la autenticación.`,
  })
  @UseGuards(LoginGoogleAuthGuard)
  async googleLoginAuth(@Req() req: Request) {}

  @Get('api/callback/google/login')
  @ApiOperation({
    summary: 'Callback de Google para inicio de sesión',
    description: `
      Esta ruta es llamada después de que Google autentica al usuario. 
      Si la autenticación es exitosa, se genera un token JWT y se redirige al usuario de vuelta al frontend con el token como parámetro.`,
  })
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
  @ApiOperation({
    summary: 'Registro de cliente con Google',
    description: `
      Esta ruta permite a los usuarios registrarse en la plataforma utilizando su cuenta de Google. 
      Utiliza un guardián (CustomerGoogleAuthGuard) para manejar el proceso de autenticación de Google.`,
  })
  @UseGuards(CustomerGoogleAuthGuard)
  async googleCustomerAuth(@Req() req: Request) {}

  @Get('api/callback/google/register/customer')
  @ApiOperation({
    summary: 'Callback de Google para registro de cliente',
    description: `
      Esta ruta es el callback después de que el usuario se autentica con Google durante el proceso de registro. 
      Si el usuario ya existe en el sistema, se redirige a la página de inicio de sesión. 
      De lo contrario, se crea una cuenta y un carrito para el nuevo usuario.`,
  })
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
