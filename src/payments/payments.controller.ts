import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession() {
    return 'create';
  }

  @Get('success')
  success() {
    return 'get';
  }

  @Get('cancel')
  cancel() {
    return 'get';
  }

  @Post('webhook')
  webhook() {
    return 'post';
  }
}
