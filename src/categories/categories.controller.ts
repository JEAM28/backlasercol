import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'obtener todas las categorias',
    description: `
      Esta ruta permite obtener todas las categorias disponibles en la base de datos.
    `,
  })
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'obtener categoria pro ID',
    description: `
      Esta ruta permite obtener la categoria cuyo ID coincida con el proporcionado.
      Se espera recibir el ID del producto en el parámetro de ruta 'id'..
    `,
  })
  getCategoriesById(@Param('id') id: string) {
    return this.categoriesService.getCategoriesById(id);
  }
}
