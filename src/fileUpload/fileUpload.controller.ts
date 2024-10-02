import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './fileUpload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags("FileUpload")
@ApiBearerAuth()
@Controller('file')
@UseGuards(AuthGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: "Subir una imagen para un producto",
    description: `
      Esta ruta permite subir una imagen para un producto específico, identificado por su ID. 
      Se debe proporcionar el ID del producto en el parámetro de la URL y el archivo de imagen en el cuerpo de la solicitud.
      Las imágenes permitidas son de tipo JPG, JPEG, PNG y WEBP, y el tamaño máximo permitido es de 200 KB.
      La ruta requiere autenticación mediante token Bearer, y los usuarios deben estar autenticados para poder realizar esta operación.
    `
  })
  uploadImage(
    @Param('id') productId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 200000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileUploadService.uploadImage(file, productId);
  }
}
