import crypto from "node:crypto";
import fs from "node:fs/promises";
import { LICENSE_CACHE_DIR, LICENSE_CACHE_PATH, PRODUCT_ID } from "../config";
import { LicenseCacheRecord } from "../types";

export async function readLicenseCache(): Promise<LicenseCacheRecord | null> {
  try {
    const raw = await fs.readFile(LICENSE_CACHE_PATH, "utf8");
    const parsed = JSON.parse(raw) as LicenseCacheRecord;
    if (!parsed.productId || !parsed.expiresAt || !parsed.email) {
      return null;
    }
    if (parsed.productId !== PRODUCT_ID) {
      return null;
    }
    return parsed;
  } catch (error) {
    const e = error as NodeJS.ErrnoException;
    if (e.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function writeLicenseCache(record: LicenseCacheRecord): Promise<void> {
  await fs.mkdir(LICENSE_CACHE_DIR, { recursive: true });
  await fs.writeFile(LICENSE_CACHE_PATH, JSON.stringify(record, null, 2), "utf8");
}

export function isCacheRecordValid(record: LicenseCacheRecord): boolean {
  const expires = new Date(record.expiresAt).getTime();
  return Number.isFinite(expires) && expires > Date.now();
}

export function fingerprintToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex").slice(0, 16);
}
