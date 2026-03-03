import { getPolarApiKey, getPolarVerifyUrl, PRODUCT_ID } from "../config";

export interface PolarVerifySuccess {
  ok: true;
  expiresAt: string;
}

export interface PolarVerifyFailure {
  ok: false;
  reason: string;
}

export type PolarVerifyResult = PolarVerifySuccess | PolarVerifyFailure;

interface PolarResponseShape {
  valid?: boolean;
  expires_at?: string;
  error?: string;
}

export async function verifyPurchaseWithPolar(email: string, purchaseToken: string): Promise<PolarVerifyResult> {
  const response = await fetch(getPolarVerifyUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${getPolarApiKey()}`
    },
    body: JSON.stringify({
      productId: PRODUCT_ID,
      email,
      purchaseToken
    })
  });

  if (!response.ok) {
    return { ok: false, reason: `Polar verification failed (${response.status}).` };
  }

  const data = (await response.json()) as PolarResponseShape;
  if (!data.valid || !data.expires_at) {
    return { ok: false, reason: data.error || "Purchase is not valid." };
  }

  return { ok: true, expiresAt: data.expires_at };
}
