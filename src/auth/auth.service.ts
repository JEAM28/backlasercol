import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import * as brypt from 'bcrypt';
import { loginGoogleUser } from 'src/types/login.google.user';
import { GoogleRegisterUser } from 'src/types/register.google.user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: Partial<Users>) {
    const { email, password } = user;

    const userFound = await this.usersService.getUserByEmail(email);

    if (userFound) {
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

  async login(email: string, password: string) {
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
      isAdmin: userFound.isAdmin,
    };

    const token = this.jwtService.sign(userPayload);
    const id = userFound.id;
    return {
      message: 'El usuario ha iniciado sesion correctamente',
      token,
      id,
    };
  }
  async googleLogin(details: loginGoogleUser) {
    const customer = await this.usersService.getUserByEmail(details.email);

    if (!customer) {
      return 'googleLoginError';
    }
    if (customer) {
      return customer;
    }
  }
  async googleRegisterCustomer(details: GoogleRegisterUser) {
    const foundCostumer = await this.usersService.getUserByEmail(details.email);

    if (foundCostumer) return 'GoogleRegisterError=userExists';

    const newCostumer = await this.userRepository.save(details);
    if (!newCostumer) return 'googleRegisterError=internalError';
    return newCostumer;
  }
}
