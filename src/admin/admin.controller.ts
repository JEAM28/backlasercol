import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
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
  @ApiOperation({
    summary: 'Crear un nuevo administrador',
    description: `
      Esta ruta permite crear un nuevo administrador proporcionando los datos necesarios a través de un DTO ('createAdminDto'). 
      El password será automáticamente cifrado antes de guardar el nuevo administrador en la base de datos.
    `,
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión como administrador',
    description: `
      Esta ruta permite a los administradores iniciar sesión proporcionando su 'email' y 'password'. 
      Si las credenciales son correctas, se devuelve un token JWT que puede ser utilizado para autenticación en futuras solicitudes.
    `,
  })
  login(@Body() credentials: LoginAdminDTO) {
    const { email, password } = credentials;
    return this.adminService.login(email, password);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') adminId: string): Promise<string> {
    return this.adminService.deleteAdmin(adminId);
  }
}
