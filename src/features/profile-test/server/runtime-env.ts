type RequiredRuntimeName =
  | "ADMIN_PASSWORD"
  | "SESSION_SECRET"
  | "LINK_ENCRYPTION_KEY";
type OptionalRuntimeName = "APP_BASE_URL";

function readRuntimeValue(name: string): string | null {
  return process.env[name] || null;
}

export function getRuntimeValue(name: RequiredRuntimeName): string {
  const value = readRuntimeValue(name);
  if (value) return value;

  throw new Error(`Missing required runtime value: ${name}`);
}

export function getOptionalRuntimeValue(name: OptionalRuntimeName): string | null {
  return readRuntimeValue(name);
}
