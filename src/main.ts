import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerDescription } from './swaggerDescription';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
  .setTitle("NESTJS API - Ecommerce Lasercol")
  .setDescription(swaggerDescription)
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000);
}
bootstrap();
