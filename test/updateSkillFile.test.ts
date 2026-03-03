import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { upsertManagedSkillFile } from "../src/io/updateSkillFile";

const tmpDirs: string[] = [];
const localTmpRoot = path.join(process.cwd(), ".tmp-tests");

async function makeTmpDir(): Promise<string> {
  await fs.mkdir(localTmpRoot, { recursive: true });
  const dir = await fs.mkdtemp(path.join(localTmpRoot, "typeui-sh-test-"));
  tmpDirs.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(
    tmpDirs.splice(0).map(async (dir) => {
      await fs.rm(dir, { recursive: true, force: true });
    })
  );
});

describe("upsertManagedSkillFile", () => {
  it("creates a file when missing", async () => {
    const root = await makeTmpDir();
    const result = await upsertManagedSkillFile(
      root,
      "cursor/skills/design-system/SKILL.md",
      "<!-- TYPEUI_SH_MANAGED_START -->\nhello\n<!-- TYPEUI_SH_MANAGED_END -->"
    );
    expect(result.changed).toBe(true);
    const content = await fs.readFile(result.absPath, "utf8");
    expect(content).toContain("hello");
  });

  it("replaces only managed section on update", async () => {
    const root = await makeTmpDir();
    const rel = "cursor/skills/design-system/SKILL.md";
    const abs = path.join(root, rel);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(
      abs,
      [
        "# Manual Header",
        "",
        "<!-- TYPEUI_SH_MANAGED_START -->",
        "old content",
        "<!-- TYPEUI_SH_MANAGED_END -->",
        "",
        "Manual footer"
      ].join("\n"),
      "utf8"
    );

    const result = await upsertManagedSkillFile(
      root,
      rel,
      "<!-- TYPEUI_SH_MANAGED_START -->\nnew content\n<!-- TYPEUI_SH_MANAGED_END -->"
    );

    expect(result.changed).toBe(true);
    const content = await fs.readFile(abs, "utf8");
    expect(content).toContain("# Manual Header");
    expect(content).toContain("new content");
    expect(content).toContain("Manual footer");
    expect(content).not.toContain("old content");
  });
});
