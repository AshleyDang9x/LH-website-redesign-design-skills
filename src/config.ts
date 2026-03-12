import path from "node:path";
import os from "node:os";

export const PRODUCT_ID = "typeui.sh";
export const MANAGED_BLOCK_START = "<!-- TYPEUI_SH_MANAGED_START -->";
export const MANAGED_BLOCK_END = "<!-- TYPEUI_SH_MANAGED_END -->";
export const API_DOMAIN = "https://www.typeui.sh";
export const GITHUB_REGISTRY_REPO_URL = "https://github.com/bergside/awesome-design-skills";
export const GITHUB_REGISTRY_RAW_BASE_URL =
  "https://raw.githubusercontent.com/bergside/awesome-design-skills/main";
export const PRICING_URL = "https://www.typeui.sh/#pricing";
export const POLAR_VERIFY_URL = `${API_DOMAIN}/api/license/verify`;
export const REGISTRY_SPECS_URL = `${GITHUB_REGISTRY_RAW_BASE_URL}/skills/index.json`;

export const LICENSE_CACHE_DIR = path.join(os.homedir(), ".typeui-sh");
export const LICENSE_CACHE_PATH = path.join(LICENSE_CACHE_DIR, "license.json");

export function getPolarVerifyUrl(): string {
  return POLAR_VERIFY_URL;
}

export function getRegistryPullUrl(skillPath: string): string {
  const encodedPath = skillPath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${GITHUB_REGISTRY_RAW_BASE_URL}/${encodedPath}`;
}

export function getRegistrySpecsUrl(): string {
  return REGISTRY_SPECS_URL;
}

export function getDesignSystemUrl(slug: string): string {
  return `${GITHUB_REGISTRY_REPO_URL}/tree/main/skills/${encodeURIComponent(slug)}`;
}

export function getDesignSystemPreviewUrl(slug: string): string {
  return `${API_DOMAIN}/design-systems/${encodeURIComponent(slug)}`;
}
