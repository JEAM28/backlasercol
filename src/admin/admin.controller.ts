import { Body, Controller, Post, Get, Query, UseGuards } from '@nestjs/common';
import { CreateAdminDto, LoginAdminDTO } from './createAdminDto';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
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

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener lista de administradores',
    description: `
      Esta ruta permite a los administradores obtener una lista de administradores paginada. 
      Se pueden especificar los parámetros de consulta 'page' (página) y 'limit' (límite) para controlar 
      la paginación. Si no se proporcionan, se devolverá la primera página con un límite de 10 usuarios.
    `,
  })
  getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    if (page && limit) {
      return this.adminService.getAllAdmins(page, limit);
    }
    return this.adminService.getAllAdmins(1, 10);
  }

}
