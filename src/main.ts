import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
  .setTitle("NESTJS API - Ecommerce Lasercol")
  .setDescription(
    "Esta API proporciona todas las funcionalidades para gestionar un ecommerce especializado en productos de impresión láser. Incluye autenticación de usuarios, gestión de productos, pedidos y administración de categorías. Las rutas están protegidas con JWT para garantizar que solo usuarios autorizados puedan acceder a ciertas funcionalidades. La API está diseñada para ser escalable y eficiente, utilizando el framework NestJS para su implementación."
  )
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000);
}
bootstrap();
