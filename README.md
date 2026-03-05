# typeui.sh

`typeui.sh` is a paid CLI that interviews you about your design system and generates `SKILL.md` files for AI coding agents.

## Get a license

You can purchase a license at [https://typeui.sh](https://typeui.sh).

To use this CLI legally, each user must have a valid purchased license key.

## Install and run

Use with `npx`:

```bash
npx typeui.sh --help
```

For local development:

```bash
npm install
npm run build
node dist/cli.js --help
```

## Commands

- `typeui.sh verify` - verify your license key and cache local license status.
- `typeui.sh license` - show local cached license status.
- `typeui.sh generate` - run the interactive design-system prompts and generate skill files.
- `typeui.sh update` - update existing managed skill content in generated files.
- `typeui.sh clear-cache` - remove local cache state (`~/.typeui-sh`).

Shared options for `generate` and `update`:

- `-p, --providers <providers>` (comma-separated provider keys)
- `--dry-run` (preview changes without writing files)

Examples:

```bash
npx typeui.sh verify
npx typeui.sh generate
npx typeui.sh update --dry-run
npx typeui.sh generate --providers cursor,claude-code,mistral-vibe
```

## Generated files

Universal target (always included):

- `.agents/skills/design-system/SKILL.md`

Optional additional targets can be selected interactively or via `--providers`.
Each generated file path ends with:

- `.../skills/design-system/SKILL.md`

Common examples:

- `.cursor/skills/design-system/SKILL.md`
- `.claude/skills/design-system/SKILL.md`
- `.codex/skills/design-system/SKILL.md`
- `.opencode/skills/design-system/SKILL.md`

## Safe updates

Generated files include these managed markers:

- `<!-- TYPEUI_SH_MANAGED_START -->`
- `<!-- TYPEUI_SH_MANAGED_END -->`

`typeui.sh update` only replaces content inside that managed block.

## End-user guide

For a full walkthrough (license activation and every prompt step), see `README.user.md`.

## Development

```bash
npm run typecheck
npm run test
npm run build
```
