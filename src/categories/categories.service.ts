import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { Categories } from './categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as data from '../data.json';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

 async onModuleInit() {
    let promises = data?.map(async (element) => {
      await this.categoriesRepository
        .createQueryBuilder()
        .insert()
        .into(Categories)
        .values({ name: element.category })
        .onConflict(`("name") DO NOTHING`)
        .execute();
    });
    
    await Promise.all(promises)
  }

  async getCategories() {
    return await this.categoriesRepository.find();
  }

  async getCategoriesById(id: string) {
    const categories = await this.categoriesRepository.findOneBy({ id });
    if (!categories) {
      throw new BadRequestException('categoria no encontrada');
    }
    return categories;
  }
}
