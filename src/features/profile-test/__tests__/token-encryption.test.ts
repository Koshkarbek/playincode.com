/** @jest-environment node */

import { decryptToken, encryptToken } from "../crypto";

const KEY = "test-link-encryption-key-with-more-than-32-characters";

describe("personal-link token encryption", () => {
  test("encrypts and decrypts a token", async () => {
    const token = "personal-token-that-must-not-be-stored-in-plain-text";
    const encrypted = await encryptToken(token, KEY);

    expect(encrypted).not.toBe(token);
    expect(encrypted).not.toContain(token);
    await expect(decryptToken(encrypted, KEY)).resolves.toBe(token);
  });

  test("uses a fresh IV for every encrypted token", async () => {
    const token = "same-token";
    const first = await encryptToken(token, KEY);
    const second = await encryptToken(token, KEY);

    expect(first).not.toBe(second);
    await expect(decryptToken(first, KEY)).resolves.toBe(token);
    await expect(decryptToken(second, KEY)).resolves.toBe(token);
  });

  test("rejects a token encrypted with another key", async () => {
    const encrypted = await encryptToken("personal-token", KEY);

    await expect(
      decryptToken(encrypted, "another-link-encryption-key"),
    ).rejects.toThrow();
  });
});
