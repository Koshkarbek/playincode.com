export function normalizeAccessCode(value: unknown): string {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}
