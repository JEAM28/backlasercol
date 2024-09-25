import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories/categories.service';

@Controller('home')
export class HomeController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async obtenerDatosHome() {
    const categorias = await this.categoriesService.getCategories();
    return {
      categorias,
    };
  }
}
