import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './createAdminDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<string> {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const newAdmin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
      isAdmin: true,
    });

    await this.adminRepository.save(newAdmin);

    return 'Administrador creado exitosamente';
  }
}
