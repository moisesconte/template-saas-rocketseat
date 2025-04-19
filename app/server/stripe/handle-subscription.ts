import "serve-static";

import type Stripe from "stripe";

export async function handleStripeSubscription(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  console.log("handleStripePayment", event);

  if (event.data.object.payment_status === "paid") {
    console.log("Pagamento realizado com sucesso. Liberar o acesso");
  }
}
