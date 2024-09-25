import { Injectable } from '@nestjs/common';
import { UsersRpository } from './users.repository';
import { UsersI } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRpository) {}

  getUsers(page: number, limit: number) {
    return this.usersRepository.getUsers(page, limit);
  }

  getUserById(id: string) {
    return this.usersRepository.getUserById(id);
  }

  createUser(user: UsersI) {
    return this.usersRepository.createUser(user);
  }

  updateUser(id: string, user: UsersI) {
    return this.usersRepository.updateUser(id, user);
  }

  deleteUserById(id: string) {
    return this.usersRepository.deleteUserById(id);
  }

  getUserByName(name: string) {
    return this.usersRepository.getUserByName(name);
  }
}
