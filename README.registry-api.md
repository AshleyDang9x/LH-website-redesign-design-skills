# Registry API (CLI Integration)

This document captures request/response details used by the CLI registry commands.

## Registry pull API (for CLI)

The `pull` command calls:

- `POST /api/registry/pull/:slug`

Request payload:

```json
{
  "licenseKey": "<license_key>"
}
```

Behavior:

- License is verified server-side first.
- `skillMd` is fetched only for valid licenses.
- Success response body is raw markdown with `Content-Type: text/markdown; charset=utf-8`.
- Protected responses use `Cache-Control: no-store`.

Typical responses:

- `200` with raw markdown body when license is valid and the slug exists.
- `403` with `{"ok": false, "reason": "license_invalid"}` when license is invalid/inactive.
- `404` with `{"ok": false, "reason": "not_found"}` when slug is missing or has no markdown.
- `400` for malformed request JSON, invalid license key, or invalid slug.
- `429` when pull requests are rate-limited.
- `500` for missing server configuration.
- `502` when upstream Polar/Convex dependencies are unreachable.

## Registry specs API (license-gated)

The `list` command calls:

- `POST /api/registry/specs`

Request payload:

```json
{
  "licenseKey": "<license_key>"
}
```

Success response:

```json
{
  "ok": true,
  "specs": [
    {
      "name": "Paper",
      "slug": "paper",
      "image": "/registry-examples/paper.png",
      "previewUrl": "#",
      "hasSkillMd": true
    }
  ]
}
```

Typical responses:

- `200` with `specs` when license is valid.
- `403` with `{"ok": false, "reason": "license_invalid"}` when license is invalid/inactive.
- `400` for malformed request JSON or invalid license key.
- `429` when requests are rate-limited.
- `500` for missing server configuration.
- `502` when upstream Polar/Convex dependencies are unreachable.
