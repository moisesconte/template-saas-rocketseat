import { type NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");

    if (!xSignature || !xRequestId) {
      return NextResponse.json({ error: "Missing headers" }, { status: 400 });
    }

    const signatureParts = xSignature.split(",");
    let ts = "";
    let v1 = "";

    signatureParts.forEach((part) => {
      const [key, value] = part.split("=");
      if (key.trim() === "ts") {
        ts = value.trim();
      } else if (key.trim() === "v1") {
        v1 = value.trim();
      }
    });

    if (!ts || !v1) {
      return NextResponse.json(
        { error: "Invalid x-signature header format" },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const dataId = url.searchParams.get("data_id");

    let manifest = "";
    if (dataId) {
      manifest += `id:${dataId}`;
    }
    if (xRequestId) {
      manifest += `id:${xRequestId}`;
    }
    manifest += `ts:${ts}`;

    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET_KEY;
    const hmac = crypto.createHmac("sha256", secret as string);
    const generatedHash = hmac.digest("hex");

    if (generatedHash !== v1) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = await req.json();

    const { type, data } = body;

    //webhook aqui

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
