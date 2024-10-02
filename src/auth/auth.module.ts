import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginGoogleAuthGuard } from 'src/guards/login.google.guard';
import { loginGoogleStrategy } from 'src/strategies/login.google.strategy';
import { Repository } from 'typeorm';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { RegisterGoogleStrategy } from 'src/strategies/register.google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'google-register' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LoginGoogleAuthGuard,
    loginGoogleStrategy,
    RegisterGoogleStrategy,
  ],
})
export class AuthModule {}
