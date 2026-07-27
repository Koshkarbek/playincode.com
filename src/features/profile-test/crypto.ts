function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return Uint8Array.from(bytes).buffer;
}

const TOKEN_CIPHERTEXT_VERSION = "v1";

async function aesKey(secret: string): Promise<CryptoKey> {
  const keyBytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(secret),
  );
  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptToken(
  token: string,
  secret: string,
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await aesKey(secret),
    new TextEncoder().encode(token),
  );
  return [
    TOKEN_CIPHERTEXT_VERSION,
    bytesToBase64Url(iv),
    bytesToBase64Url(new Uint8Array(ciphertext)),
  ].join(".");
}

export async function decryptToken(
  encrypted: string,
  secret: string,
): Promise<string> {
  const [version, encodedIv, encodedCiphertext, extra] =
    encrypted.split(".");
  if (
    version !== TOKEN_CIPHERTEXT_VERSION ||
    !encodedIv ||
    !encodedCiphertext ||
    extra
  ) {
    throw new Error("Invalid encrypted token");
  }

  const plaintext = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: bytesToArrayBuffer(base64UrlToBytes(encodedIv)),
    },
    await aesKey(secret),
    bytesToArrayBuffer(base64UrlToBytes(encodedCiphertext)),
  );
  return new TextDecoder().decode(plaintext);
}

export function randomToken(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export function randomCode(): string {
  return `STU-${randomToken(6).toUpperCase().replaceAll("-", "X").replaceAll("_", "Y")}`;
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

export function decodeBase64Url(value: string): string {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

export function encodeBase64Url(value: string): string {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

export function safeEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |=
      (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}
