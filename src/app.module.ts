import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { NatsModule } from './transport/nats.module';

@Module({
  imports: [PaymentsModule, NatsModule],
})
export class AppModule {}
