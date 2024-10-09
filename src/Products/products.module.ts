import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { Categories } from 'src/categories/categories.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Categories]), CategoriesModule],

  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
