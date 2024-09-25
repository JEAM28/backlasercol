import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Products } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from 'src/categories/categories.entity';
import * as data from '../data.json';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async onModuleInit() {
    const count = await this.productsRepository.count();
    if (count === 0) {
      console.log('La tabla de productos está vacía. Precargando datos...');
      await this.addProductsSeeder();
    } else {
      console.log('La tabla de productos ya tiene datos.');
    }
  }

  async getProducts(page: number, limit: number): Promise<Products[]> {
    let products = await this.productsRepository.find({
      relations: {
        category: true,
      },
      order: {
        nombre: 'ASC',
      },
    });
    const start = (page - 1) * limit;
    const end = start + +limit;
    products = products.slice(start, end);
    return products;
  }

  async addProductsSeeder() {
    const categories = await this.categoriesRepository.find();
    data?.map(async (element) => {
      const category = categories.find(
        (category) => category.name === element.category,
      );
      const product = new Products();

      product.nombre = element.nombre;
      product.color = element.color;
      product.material = element.material;
      product.medidas = element.medidas;
      product.stock = element.stock;
      product.valor = element.valor;
      product.imgUrl = element.imgUrl;
      product.category = category;

      await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Products)
        .values(product)
        .execute();
    });
    return 'productos agregados';
  }

  async getProductById(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async getProductByName(name: string) {
    const product = await this.productsRepository.findOneBy({ nombre: name });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async addProduct(product: Partial<Products>) {
    const newProduct = this.productsRepository.create(product);
    return await this.productsRepository.save(newProduct);
  }

  async editProduct(id: string, product: Partial<Products>) {
    const existingProduct = await this.productsRepository.findOneBy({ id });
    if (!existingProduct) {
      throw new NotFoundException('Producto no encontrado');
    }
    const updatedProduct = Object.assign(existingProduct, product);
    return await this.productsRepository.save(updatedProduct);
  }

  async deleteProduct(id: string) {
    const existingProduct = await this.productsRepository.findOneBy({ id });
    if (!existingProduct) {
      throw new NotFoundException('Producto no encontrado');
    }
    await this.productsRepository.remove(existingProduct);
    return { message: `Producto con el id ${id} fue eliminado` };
  }

  async getProductByCategory(category: string) {
    const categoryEntity = await this.categoriesRepository.findOneBy({
      name: category,
    });
    if (!categoryEntity) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const products = await this.productsRepository.find({
      where: { category: categoryEntity },
      relations: { category: true },
    });

    if (products.length === 0) {
      throw new NotFoundException(
        'No se encontraron productos en esta categoría',
      );
    }
    return products;
  }
}
