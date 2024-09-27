import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class FilesUploadRepository {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'ecommerce', resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(
              new InternalServerErrorException(
                'No se pudo subir la imagen. Por favor, intente nuevamente.',
              ),
            );
          } else {
            resolve(result);
          }
        },
      );
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}
