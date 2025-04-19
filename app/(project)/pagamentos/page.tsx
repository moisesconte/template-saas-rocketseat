"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Pagamentos() {
  const {
    createPaymentStrimeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Pagamentos</h1>

      <div className="flex flex-col gap-2 w-64">
        <button
          className="border rounded-md px-2 py-3"
          onClick={() => createPaymentStrimeCheckout({ testeId: "123" })}
          type="button"
        >
          Criar pagamento Stripe
        </button>
        <button
          className="border rounded-md px-2 py-3"
          type="button"
          onClick={() => createSubscriptionStripeCheckout({ testeId: "123" })}
        >
          Criar assinatura Stripe
        </button>
        <button
          className="border rounded-md px-2 py-3"
          type="button"
          onClick={() => handleCreateStripePortal()}
        >
          Criar portal de pagamentos
        </button>
      </div>
    </div>
  );
}
