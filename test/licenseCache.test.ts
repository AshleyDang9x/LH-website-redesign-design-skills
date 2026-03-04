import { describe, expect, it } from "vitest";
import { isCacheRecordValid } from "../src/licensing/licenseCache";

describe("isCacheRecordValid", () => {
  it("returns true for future expiry", () => {
    const valid = isCacheRecordValid({
      productId: "typeui.sh",
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      licenseKeyFingerprint: "abcd"
    });
    expect(valid).toBe(true);
  });

  it("returns false for expired cache", () => {
    const valid = isCacheRecordValid({
      productId: "typeui.sh",
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
      licenseKeyFingerprint: "abcd"
    });
    expect(valid).toBe(false);
  });
});
