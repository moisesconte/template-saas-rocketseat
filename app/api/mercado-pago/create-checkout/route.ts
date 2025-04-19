import mpClient from "@/app/lib/mercado-pago";
import { Preference } from "mercadopago";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { testeId, userEmail } = await req.json();

  try {
    const preference = new Preference(mpClient);

    const createdPreference = await preference.create({
      body: {
        external_reference: testeId, // Isso impacta na pontuação do mercado Pago
        metadata: {
          testeId, //Essa variavel é convertida para snacke_case -> teste_id
        },
        ...(userEmail && { payer_email: userEmail }), // Tambem é importante para a pontuação do Mercado Pago
        items: [
          {
            id: "",
            title: "",
            description: "",
            quantity: 1,
            unit_price: 1,
            currency_id: "BRL",
            category_id: "services",
          },
        ],
        payment_methods: {
          installments: 12,
          // excluded_payment_methods: [    //Desabilitando pagamento com boleto e PEC
          //   {
          //     id: "bolbradesco",
          //   },
          //   {
          //     id: "pec",
          //   },
          // ],
          // excluded_payment_types: [ //Desabilitando pagamento com cartão de débito
          //   {
          //     id: "debit_card",
          //   },
          // ],
        },
        auto_return: "approved",
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/webhook/pending`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/webhook/pending`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/webhook/pending`,
        },
      },
    });

    if (!createdPreference.id) {
      return NextResponse.json(
        { error: "Erro ao criar o checkout com o Mercado Pago" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initial_point: createdPreference.init_point,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar o checkout com o Mercado Pago" },
      { status: 500 }
    );
  }
}
