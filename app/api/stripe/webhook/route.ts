import stripe from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const secretKey = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature || !secretKey) {
      return NextResponse.json(
        { error: "No signature or secret key" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, secretKey);

    switch (event.type) {
      case "checkout.session.completed": {
        //Pagamento realizado
        const metadata = event.data.object.metadata;

        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event);
        }

        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event);
        }

        break;
      }
      case "checkout.session.expired": //Pagamento expirado
        console.log(
          "Enviar um email para o usuario avisando que o pagamento expirou"
        );
        break;
      case "checkout.session.async_payment_succeeded": //Boleto pago
        console.log(
          "Enviar um email para o usuario avisando que o pagamento foi realizado"
        );
        break;
      case "checkout.session.async_payment_failed": //Boleto falhou
        console.log(
          "Enviar um email para o usuario avisando que o pagamento falhou"
        );
        break;
      case "customer.subscription.created": //Assinatura criada
        console.log(
          "Enviar um email para o usuario avisando que a assinatura foi criada"
        );
        break;
      case "customer.subscription.deleted": //Assinatura cancelada
        await handleStripeCancelSubscription(event);
        break;
      default:
        throw new Error(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Erro ao processar o evento", error);
    return NextResponse.json(
      { error: "Erro ao processar o evento" },
      { status: 500 }
    );
  }
}
