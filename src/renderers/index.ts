import { DesignSystemInput, Provider, ProviderFile } from "../types";
import { renderClaudeSkill } from "./claudeRenderer";
import { renderCodexSkill } from "./codexRenderer";
import { renderCursorSkill } from "./cursorRenderer";
import { renderOpenCodeSkill } from "./openCodeRenderer";

type RendererFn = (design: DesignSystemInput) => ProviderFile;

const renderers: Record<Provider, RendererFn> = {
  codex: renderCodexSkill,
  cursor: renderCursorSkill,
  "claude-code": renderClaudeSkill,
  "open-code": renderOpenCodeSkill
};

export function renderProviderFiles(design: DesignSystemInput, providers: Provider[]): ProviderFile[] {
  return providers.map((provider) => renderers[provider](design));
}
