import { PRODUCT_ID } from "../config";
import { promptLicenseCredentials } from "../prompts/license";
import { LicenseCacheRecord } from "../types";
import {
  clearLocalLicenseState,
  fingerprintToken,
  isCacheRecordValid,
  readLicenseCache,
  writeLicenseCache
} from "./licenseCache";
import { verifyPurchaseWithPolar } from "./polarClient";

function buildCacheRecord(licenseKey: string, expiresAt: string): LicenseCacheRecord {
  return {
    productId: PRODUCT_ID,
    verifiedAt: new Date().toISOString(),
    expiresAt,
    licenseKeyFingerprint: fingerprintToken(licenseKey),
    licenseKey
  };
}

export async function ensureVerifiedAccess(): Promise<void> {
  const cached = await readLicenseCache();
  if (cached && isCacheRecordValid(cached)) {
    return;
  }

  const { licenseKey } = await promptLicenseCredentials();
  const verifyResult = await verifyPurchaseWithPolar(licenseKey);

  if (!verifyResult.ok) {
    throw new Error(`License verification failed: ${verifyResult.reason}`);
  }

  await writeLicenseCache(buildCacheRecord(licenseKey, verifyResult.expiresAt));
}

export async function getVerifiedLicenseKey(): Promise<string> {
  const cached = await readLicenseCache();
  if (cached && isCacheRecordValid(cached) && cached.licenseKey) {
    return cached.licenseKey;
  }

  const { licenseKey } = await promptLicenseCredentials();
  const verifyResult = await verifyPurchaseWithPolar(licenseKey);

  if (!verifyResult.ok) {
    throw new Error(`License verification failed: ${verifyResult.reason}`);
  }

  await writeLicenseCache(buildCacheRecord(licenseKey, verifyResult.expiresAt));
  return licenseKey;
}

export async function verifyAndCacheLicenseFromPrompt(): Promise<LicenseCacheRecord> {
  const { licenseKey } = await promptLicenseCredentials();
  const verifyResult = await verifyPurchaseWithPolar(licenseKey);

  if (!verifyResult.ok) {
    throw new Error(`License verification failed: ${verifyResult.reason}`);
  }

  const cacheRecord = buildCacheRecord(licenseKey, verifyResult.expiresAt);
  await writeLicenseCache(cacheRecord);
  return cacheRecord;
}

export async function getCachedLicenseSummary(): Promise<string> {
  const cached = await readLicenseCache();
  if (!cached) {
    return "No cached license.";
  }
  const status = isCacheRecordValid(cached) ? "valid" : "expired";
  return `Cached license (${cached.licenseKeyFingerprint}) is ${status} until ${cached.expiresAt}.`;
}

export async function clearCachedLicenseState(): Promise<void> {
  await clearLocalLicenseState();
}
