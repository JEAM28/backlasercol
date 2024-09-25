import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersI } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    if (page && limit) {
      return this.usersService.getUsers(page, limit);
    }
    return this.usersService.getUsers(1, 30);
  }

  @Get(':name')
  getUserByName(@Param('name') name: string) {
    return this.usersService.getUserByName(name);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post()
  createUser(@Body() user: UsersI) {
    const id = this.usersService.createUser(user);
    return user;
  }

  @Put(':id')
  updatUser(@Param('id') id: string, @Body() user: UsersI) {
    this.usersService.updateUser(id, user);
    return user;
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
