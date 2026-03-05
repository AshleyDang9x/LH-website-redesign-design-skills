import { getPolarVerifyUrl } from "../config";

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
  reason?: string;
  status?: string;
  expires_at?: string;
  expiresAt?: string;
  error?: string;
}

const VERIFY_CACHE_TTL_DAYS = 31;

export async function verifyPurchaseWithPolar(licenseKey: string): Promise<PolarVerifyResult> {
  const verifyUrl = getPolarVerifyUrl();
  let response: Response;
  try {
    response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        licenseKey
      })
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      reason: `Could not reach license server at ${verifyUrl}: ${message}. Please ensure your network connection is available and try again.`
    };
  }

  if (!response.ok) {
    let serverReason: string | undefined;
    try {
      const errorData = (await response.json()) as PolarResponseShape;
      serverReason = errorData.reason || errorData.error;
    } catch {
      // Ignore JSON parse failures and fall back to status-only message.
    }
    return {
      ok: false,
      reason: serverReason
        ? `License verification failed (${response.status}): ${serverReason}.`
        : `License verification failed (${response.status}).`
    };
  }

  const data = (await response.json()) as PolarResponseShape;
  if (!data.valid || data.reason !== "active" || data.status !== "granted") {
    return { ok: false, reason: data.reason || data.error || "License key is not valid." };
  }

  return {
    ok: true,
    // Local cache is fixed to 31 days from verification.
    expiresAt: new Date(Date.now() + VERIFY_CACHE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()
  };
}
