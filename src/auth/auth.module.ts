import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users]),
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn: '1h'},
  }),
  ConfigModule.forRoot({
    isGlobal: true, // Hacer que ConfigModule esté disponible globalmente
  }),
],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
