import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountService } from './code.service';
import { DiscountController } from './code.controller';
import { DiscountCode } from './code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountCode])],
  providers: [DiscountService],
  controllers: [DiscountController],
})
export class DiscountModule {}
