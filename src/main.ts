import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerDescription } from './swaggerDescription';
import * as session from 'express-session';
import { config as dotenvConfig } from 'dotenv';
import * as passport from 'passport';

dotenvConfig({ path: '.env' });
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('bruno');
  app.enableCors({
    origin: 'https://lasercol.vercel.app', // Especifica el origen permitido
    credentials: true, // Permitir credenciales como cookies
  });

  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle('NESTJS API - Ecommerce Lasercol')
    .setDescription(swaggerDescription)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(PORT);
}
bootstrap();
