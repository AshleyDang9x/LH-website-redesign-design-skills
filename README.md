# typeui.sh

`typeui.sh` is a paid CLI that interviews your team about design-system decisions and generates provider-specific skill markdown files for:

- Codex
- Cursor
- Claude Code
- Open Code

It can also update existing files in-place using a managed block so your manual notes are preserved.

## Install and run

For local development:

```bash
npm install
npm run build
node dist/cli.js --help
```

Published usage target:

```bash
npx typeui.sh init
```

## Commands

- `typeui.sh verify` - verify Polar purchase and cache a local license.
- `typeui.sh license` - show current cached license status.
- `typeui.sh init` - verify + prompt + generate files.
- `typeui.sh generate` - generate files after license verification.
- `typeui.sh update` - update existing files (managed section only).

Shared options:

- `--providers codex,cursor,claude-code,open-code`
- `--dry-run`

## License verification (Polar)

This CLI is gated by purchase verification.

Required environment variables:

- `POLAR_VERIFY_URL`: your verification API endpoint.
- `POLAR_ACCESS_TOKEN`: bearer token used to call that endpoint.

Expected verify request payload:

```json
{
  "productId": "typeui.sh",
  "email": "buyer@example.com",
  "purchaseToken": "polar_purchase_token"
}
```

Expected verify response payload:

```json
{
  "valid": true,
  "expires_at": "2026-12-31T23:59:59.000Z"
}
```

On success, `typeui.sh` stores a minimal cache record at `~/.typeui-sh/license.json` and allows offline use until `expires_at`.

## Generated file paths

- `.codex/skills/design-system/SKILL.md`
- `.cursor/skills/design-system/SKILL.md`
- `.claude/skills/design-system/SKILL.md`
- `.opencode/skills/design-system/SKILL.md`

Each file uses these markers for safe updates:

- `<!-- TYPEUI_SH_MANAGED_START -->`
- `<!-- TYPEUI_SH_MANAGED_END -->`

Only content between markers is replaced during updates.

## Development

```bash
npm run typecheck
npm run test
npm run build
```
