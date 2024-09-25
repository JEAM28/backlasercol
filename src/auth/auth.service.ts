import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import * as brypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: Partial<Users>) {
    const { email, password } = user;

    const usuarioNoFound = await this.usersService.getUserByEmail(email);

    if (usuarioNoFound) {
      throw new BadRequestException('el usuario ya esta registrado');
    }

    const passwordHash = await brypt.hash(password, 10);

    if (!passwordHash) {
      throw new BadRequestException('error en la encriptacion');
    }

    return await this.usersService.createUser({
      ...user,
      password: passwordHash,
    });
  }

  async signIn(email: string, password: string) {
    const userFound = await this.usersService.getUserByEmail(email);

    if (!userFound) {
      throw new BadRequestException('Credenciales Invalidas');
    }

    const passwordValid = await brypt.compare(password, userFound.password);

    if (!passwordValid) {
      throw new BadRequestException('Credenciales Invalidas');
    }

    const userPayload = {
      id: userFound.id,
      email: userFound.email,
    };

    const token = this.jwtService.sign(userPayload);

    return {
      message: 'El usuario ha iniciado sesion correctamente',
      token,
    };
  }
}
