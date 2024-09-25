import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './Products/products.module';
import { HomeController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './file-upload/fileUpload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    FileUploadModule,
  ],
  controllers: [HomeController],
  providers: [AppService],
})
export class AppModule {}
