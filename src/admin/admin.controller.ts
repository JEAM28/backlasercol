import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminDto, LoginAdminDTO } from './createAdminDto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('login')
  login(@Body() credentials: LoginAdminDTO) {
    const { email, password } = credentials;
    return this.adminService.login(email, password);
  }
}
