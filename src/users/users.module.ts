import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Cart } from 'src/cart/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Cart])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
