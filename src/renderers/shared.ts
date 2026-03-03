import { MANAGED_BLOCK_END, MANAGED_BLOCK_START } from "../config";
import { DesignSystemInput } from "../types";

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function createManagedSkillBody(providerTitle: string, design: DesignSystemInput): string {
  return [
    MANAGED_BLOCK_START,
    `# ${design.productName} Design System Skill (${providerTitle})`,
    "",
    "## Brand",
    design.brandSummary,
    "",
    "## Style Foundations",
    `- Visual style: ${design.visualStyle}`,
    `- Typography scale: ${design.typographyScale}`,
    `- Color palette: ${design.colorPalette}`,
    `- Spacing scale: ${design.spacingScale}`,
    "",
    "## Component Families",
    list(design.componentFamilies),
    "",
    "## Accessibility",
    design.accessibilityRequirements,
    "",
    "## Writing Tone",
    design.writingTone,
    "",
    "## Rules: Do",
    list(design.doRules),
    "",
    "## Rules: Don't",
    list(design.dontRules),
    "",
    "## Expected Behavior",
    "- Follow the foundations first, then component consistency.",
    "- When uncertain, prioritize accessibility and clarity over novelty.",
    "",
    MANAGED_BLOCK_END
  ].join("\n");
}
