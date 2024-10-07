import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from 'src/Products/products.entity';
import { FilesUploadRepository } from './fileUpload.repository';
import { Users } from 'src/users/users.entity';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
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

  async userImage(file: Express.Multer.File, userId: string){
    const user = await this.userRepository.findOneBy({ id: userId})

    if (!user){
      throw new NotFoundException('usuario no encontrado')
    }

    const uploadResult = await this.filesUploadRepository.uploadImage(file);

    await this.userRepository.update(user.id, {
      profileImage: uploadResult.secure_url,
    })

    return this.userRepository.findOneBy({ id: userId })
  }
}
