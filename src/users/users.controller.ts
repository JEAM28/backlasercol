import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/users/users.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags("Users")
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: "Obtener lista de usuarios",
    description: `
      Esta ruta permite a los administradores obtener una lista de usuarios paginada. 
      Se pueden especificar los parámetros de consulta 'page' (página) y 'limit' (límite) para controlar 
      la paginación. Si no se proporcionan, se devolverá la primera página con un límite de 10 usuarios.
    `
  })
  getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    if (page && limit) {
      return this.usersService.getUsers(page, limit);
    }
    return this.usersService.getUsers(1, 10);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: "Eliminar usuario",
    description: `
      Esta ruta permite a los administradores eliminar un usuario específico basado en su 'id'.
      Es necesario tener permisos de administrador para realizar esta operación.
    `
  })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id')
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Obtener usuario por ID",
    description: `
      Esta ruta devuelve la información de un usuario específico basado en su 'id'.
      Se requiere estar autenticado para acceder a esta información, pero no es necesario ser administrador.
    `
  })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Actualizar usuario",
    description: `
      Esta ruta permite a cualquier usuario autenticado actualizar los datos de un usuario específico mediante su 'id'.
      Es necesario proporcionar un cuerpo con los datos que se desean actualizar.
    `
  })
  updateUser(@Param('id') id: string, @Body() user: CreateUserDTO) {
    return this.usersService.updateUser(id, user);
  }
}
