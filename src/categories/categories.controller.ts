import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(AuthGuard)
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  getCategoriesById(@Param('id') id: string) {
    return this.categoriesService.getCategoriesById(id);
  }
}
