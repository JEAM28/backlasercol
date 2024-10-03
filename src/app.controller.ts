import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories/categories.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('home')
export class HomeController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: "Obtener datos de la página de inicio",
    description: `
      Esta ruta se utiliza para obtener los datos necesarios para la página de inicio. 
      En este caso, la ruta devuelve las categorías de productos que están disponibles en el sistema. 
      No requiere parámetros adicionales en la solicitud.
    `
  })
  async obtenerDatosHome() {
    const categorias = await this.categoriesService.getCategories();
    return {
      categorias,
    };
  }
}
