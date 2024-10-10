import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginGoogleAuthGuard } from 'src/guards/login.google.guard';
import { LoginGoogleStrategy } from 'src/strategies/login.google.strategy';
import { Repository } from 'typeorm';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { RegisterGoogleStrategy } from 'src/strategies/register.google.strategy';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LoginGoogleAuthGuard,
    LoginGoogleStrategy,
    RegisterGoogleStrategy,
  ],
})
export class AuthModule {}
