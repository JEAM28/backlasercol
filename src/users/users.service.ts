import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from 'src/users/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async getUsers(page: number, limit: number) {
    let user = await this.userRepository.find();
    const start = (page - 1) * limit;
    const end = start + +limit;
    user = user.slice(start, end);
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!user) {
      throw new NotFoundException('usuario no fue encontrado');
    }
    return user;
  }

  async createUser(user: Partial<Users>) {
    const newUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async updateUser(id: string, user: CreateUserDTO) {
    const { passwordConfirmation, ...userNoConfirmPassword } = user;
    await this.userRepository.update(id, userNoConfirmPassword);
    const updatedUser = await this.userRepository.findOneBy({ id });
    const { password, ...userNoPassword } = updatedUser;
    return userNoPassword;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    this.userRepository.remove(user);
    return `usuario con id: ${id} se elimino correctamente`;
  }

  async getUserByEmail(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
