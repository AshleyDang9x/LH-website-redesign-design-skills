import { DesignSystemInput, PROVIDER_DETAILS, Provider, ProviderFile } from "../types";
import { createManagedSkillBody } from "./shared";

export function renderProviderFiles(design: DesignSystemInput, providers: Provider[]): ProviderFile[] {
  return providers.map((provider) => ({
    provider,
    relativePath: PROVIDER_DETAILS[provider].relativePath,
    content: createManagedSkillBody(PROVIDER_DETAILS[provider].title, design)
  }));
}
