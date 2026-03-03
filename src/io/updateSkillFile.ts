import fs from "node:fs/promises";
import path from "node:path";
import { MANAGED_BLOCK_END, MANAGED_BLOCK_START } from "../config";

function mergeWithManagedBlock(existing: string, generatedBlock: string): string {
  const startIdx = existing.indexOf(MANAGED_BLOCK_START);
  const endIdx = existing.indexOf(MANAGED_BLOCK_END);

  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    const base = existing.trimEnd();
    if (!base) {
      return `${generatedBlock}\n`;
    }
    return `${base}\n\n${generatedBlock}\n`;
  }

  const before = existing.slice(0, startIdx).trimEnd();
  const after = existing.slice(endIdx + MANAGED_BLOCK_END.length).trimStart();

  const merged = [before, generatedBlock, after].filter(Boolean).join("\n\n");
  return `${merged}\n`;
}

export async function upsertManagedSkillFile(
  projectRoot: string,
  relativePath: string,
  generatedBlock: string,
  dryRun = false
): Promise<{ absPath: string; changed: boolean }> {
  const absPath = path.resolve(projectRoot, relativePath);
  await fs.mkdir(path.dirname(absPath), { recursive: true });

  let existing = "";
  try {
    existing = await fs.readFile(absPath, "utf8");
  } catch (error) {
    const e = error as NodeJS.ErrnoException;
    if (e.code !== "ENOENT") {
      throw error;
    }
  }

  const nextContent = mergeWithManagedBlock(existing, generatedBlock);
  const changed = existing !== nextContent;

  if (!dryRun && changed) {
    await fs.writeFile(absPath, nextContent, "utf8");
  }

  return { absPath, changed };
}
