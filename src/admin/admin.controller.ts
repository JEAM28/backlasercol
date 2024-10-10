import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
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

  @Delete(':id')
  async deleteAdmin(@Param('id') adminId: string): Promise<string> {
    return this.adminService.deleteAdmin(adminId);
  }
}
