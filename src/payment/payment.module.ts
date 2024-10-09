import { Module } from '@nestjs/common';
import { PaypalController } from './payment.controller';
import { PaypalService } from './payment.service';

@Module({
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaymentsModule {}
