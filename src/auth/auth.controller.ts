import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from 'src/users/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() user: CreateUserDTO) {
    const { passwordConfirmation, ...cleanUser } = user;
    return this.authService.register(cleanUser);
  }

  @Post('/login')
  login(@Body() credentials: LoginUserDTO) {
    const { email, password } = credentials;
    return this.authService.login(email, password);
  }
}
