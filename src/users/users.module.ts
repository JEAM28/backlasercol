import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRpository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, UsersRpository],
})
export class UsersModule {}
