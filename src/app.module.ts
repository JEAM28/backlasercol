import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './Products/products.module';
import { HomeController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './fileUpload/fileUpload.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from 'src/admin/admin.module';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { DiscountModule } from './code/code.module';
import { PassportModule } from '@nestjs/passport';
<<<<<<< HEAD
import { MercadoPagoModule } from './mercadoPago/mercadoPago.module';
=======
import { PaymentsModule } from './payment/payment.module';

>>>>>>> 4e99f0bb56c01cfc02d47c05744e69fa35c7aeb8
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    OrdersModule,
    ProductsModule,
    CategoriesModule,
    FileUploadModule,
    AuthModule,
    AdminModule,
    EmailModule,
    CartModule,
    DiscountModule,
    MercadoPagoModule,
    PassportModule.register({ session: true }),
    PaymentsModule,
  ],
  controllers: [HomeController],
  providers: [AppService, EmailService],
})
export class AppModule {}
