import { PRODUCT_ID } from "../config";
import { promptLicenseCredentials } from "../prompts/license";
import { LicenseCacheRecord } from "../types";
import {
  fingerprintToken,
  isCacheRecordValid,
  readLicenseCache,
  writeLicenseCache
} from "./licenseCache";
import { verifyPurchaseWithPolar } from "./polarClient";

function buildCacheRecord(email: string, purchaseToken: string, expiresAt: string): LicenseCacheRecord {
  return {
    productId: PRODUCT_ID,
    email,
    verifiedAt: new Date().toISOString(),
    expiresAt,
    tokenFingerprint: fingerprintToken(purchaseToken)
  };
}

export async function ensureVerifiedAccess(): Promise<void> {
  const cached = await readLicenseCache();
  if (cached && isCacheRecordValid(cached)) {
    return;
  }

  const { email, purchaseToken } = await promptLicenseCredentials();
  const verifyResult = await verifyPurchaseWithPolar(email, purchaseToken);

  if (!verifyResult.ok) {
    throw new Error(`License verification failed: ${verifyResult.reason}`);
  }

  await writeLicenseCache(buildCacheRecord(email, purchaseToken, verifyResult.expiresAt));
}

export async function verifyAndCacheLicenseFromPrompt(): Promise<LicenseCacheRecord> {
  const { email, purchaseToken } = await promptLicenseCredentials();
  const verifyResult = await verifyPurchaseWithPolar(email, purchaseToken);

  if (!verifyResult.ok) {
    throw new Error(`License verification failed: ${verifyResult.reason}`);
  }

  const cacheRecord = buildCacheRecord(email, purchaseToken, verifyResult.expiresAt);
  await writeLicenseCache(cacheRecord);
  return cacheRecord;
}

export async function getCachedLicenseSummary(): Promise<string> {
  const cached = await readLicenseCache();
  if (!cached) {
    return "No cached license.";
  }
  const status = isCacheRecordValid(cached) ? "valid" : "expired";
  return `Cached license for ${cached.email} is ${status} until ${cached.expiresAt}.`;
}
