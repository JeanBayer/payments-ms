import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { envs } from 'src/config/envs';
import Stripe from 'stripe';
import { PaymentsSessionDto } from './dto/payments-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET);

  async createPaymentSession(paymentsSessionDto: PaymentsSessionDto) {
    const { currency, items, orderId } = paymentsSessionDto;

    const lineItems = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.STRIPE_SUCCESS_URL,
      cancel_url: envs.STRIPE_CANCEL_URL,
    });

    return session;
  }

  webhook(req: Request, res: Response) {
    const sign = req.headers['stripe-signature'];
    let event: Stripe.Event;
    const endpointSecret = envs.STRIPE_WEBHOOK_SECRET;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sign!,
        endpointSecret,
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }

    switch (event.type) {
      case 'charge.succeeded': {
        const charge = event.data.object;
        const { orderId } = charge.metadata;
        console.log(orderId);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(201);
  }
}
