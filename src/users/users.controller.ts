import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, UpdateUserDTO } from 'src/users/users.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener lista de usuarios',
    description: `
      Esta ruta permite a los administradores obtener una lista de usuarios paginada. 
      Se pueden especificar los parámetros de consulta 'page' (página) y 'limit' (límite) para controlar 
      la paginación. Si no se proporcionan, se devolverá la primera página con un límite de 10 usuarios.
    `,
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
    summary: 'Eliminar usuario',
    description: `
      Esta ruta permite a los administradores eliminar un usuario específico basado en su 'id'.
      Es necesario tener permisos de administrador para realizar esta operación.
    `,
  })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: `
      Esta ruta devuelve la información de un usuario específico basado en su 'id'.
      Se requiere estar autenticado para acceder a esta información, pero no es necesario ser administrador.
    `,
  })
  getUserById(@Param('id') id: string) {


    return this.usersService.getUserById(id);
  }

  @Get('session/:token')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Obtener usuario por token',
    description: `
      Esta ruta devuelve la información de un usuario específico basado en su 'id'.
      Se requiere estar autenticado para acceder a esta información, pero no es necesario ser administrador.
    `,
  })
  async getUserByToken(@Param('token') token: string) {
    let idUser = this.jwtService.decode(token)
    let sessionInfo = await this.usersService.getUserById(idUser.id);
    let infoToReturn = {
      id: sessionInfo.id,
      name: sessionInfo.name,
      email: sessionInfo.email,
      token: token
    }
    return infoToReturn
  }
  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: `
      Esta ruta permite a cualquier usuario autenticado actualizar los datos de un usuario específico mediante su 'id'.
      Es necesario proporcionar un cuerpo con los datos que se desean actualizar.
    `,
  })
  updateUser(@Param('id') id: string, @Body() user: UpdateUserDTO) {
    return this.usersService.updateUser(id, user);
  }
}
