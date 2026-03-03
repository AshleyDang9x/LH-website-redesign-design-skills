import path from "node:path";
import os from "node:os";

export const PRODUCT_ID = "typeui.sh";
export const MANAGED_BLOCK_START = "<!-- TYPEUI_SH_MANAGED_START -->";
export const MANAGED_BLOCK_END = "<!-- TYPEUI_SH_MANAGED_END -->";

export const LICENSE_CACHE_DIR = path.join(os.homedir(), ".typeui-sh");
export const LICENSE_CACHE_PATH = path.join(LICENSE_CACHE_DIR, "license.json");

export function getPolarVerifyUrl(): string {
  const url = process.env.POLAR_VERIFY_URL;
  if (!url) {
    throw new Error("Missing POLAR_VERIFY_URL environment variable.");
  }
  return url;
}

export function getPolarApiKey(): string {
  const key = process.env.POLAR_ACCESS_TOKEN;
  if (!key) {
    throw new Error("Missing POLAR_ACCESS_TOKEN environment variable.");
  }
  return key;
}
