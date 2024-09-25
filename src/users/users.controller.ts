import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    if (page && limit) {
      return this.usersService.getUsers(page, limit);
    }
    return this.usersService.getUsers(1, 5);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: CreateUserDTO) {
    return this.usersService.updateUser(id, user);
  }
}
