import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from 'src/users/users.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
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
}
