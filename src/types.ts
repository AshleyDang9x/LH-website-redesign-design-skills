export const SUPPORTED_PROVIDERS = ["codex", "cursor", "claude-code", "open-code"] as const;

export type Provider = (typeof SUPPORTED_PROVIDERS)[number];

export interface DesignSystemInput {
  productName: string;
  brandSummary: string;
  visualStyle: string;
  typographyScale: string;
  colorPalette: string;
  spacingScale: string;
  componentFamilies: string[];
  accessibilityRequirements: string;
  writingTone: string;
  doRules: string[];
  dontRules: string[];
}

export interface ProviderFile {
  provider: Provider;
  relativePath: string;
  content: string;
}

export interface LicenseCacheRecord {
  productId: string;
  email: string;
  verifiedAt: string;
  expiresAt: string;
  tokenFingerprint: string;
}
