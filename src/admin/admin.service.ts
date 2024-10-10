import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './createAdminDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
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

  async loginAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { email } });

    if (!admin || admin.password !== password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return admin;
  }

  async login(email: string, password: string) {
    const adminFound = await this.adminRepository.findOne({ where: { email } });

    if (!adminFound) {
      throw new BadRequestException('Credenciales Invalidas');
    }

    const passwordValid = await bcrypt.compare(password, adminFound.password);

    if (!passwordValid) {
      throw new BadRequestException('Credenciales Invalidas');
    }

    const userPayload = {
      id: adminFound.id,
      email: adminFound.email,
      isAdmin: adminFound.isAdmin,
    };

    const token = this.jwtService.sign(userPayload);
    const id = adminFound.id;
    return {
      message: 'ingreso de administrador exitoso',
      token,
      id,
    };
  }

  async deleteAdmin(adminId: string): Promise<string> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new BadRequestException('admin no encontrado');
    }

    await this.adminRepository.remove(admin);
    return 'administrador eliminado exitosamente';
  }
}
