import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
