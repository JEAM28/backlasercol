import { Module } from '@nestjs/common';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { FileUploadService } from './fileUpload.service';
import { FileUploadController } from './fileUpload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/Products/Products.entity';
import { FilesUploadRepository } from './fileUpload.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  controllers: [FileUploadController],
  providers: [FileUploadService, CloudinaryConfig, FilesUploadRepository],
})
export class FileUploadModule {}
