import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from 'src/products/products.entity';
import { FilesUploadRepository } from './fileUpload.repository';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    private readonly filesUploadRepository: FilesUploadRepository,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const uploadResult = await this.filesUploadRepository.uploadImage(file);

    await this.productsRepository.update(product.id, {
      imgUrl: uploadResult.secure_url,
    });

    return this.productsRepository.findOneBy({ id: productId });
  }
}
