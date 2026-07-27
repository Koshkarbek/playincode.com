import { getOptionalRuntimeValue } from "./runtime-env.ts";

function validatedHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

export function getPublicOrigin(request: Request): string {
  const configured = getOptionalRuntimeValue("APP_BASE_URL");
  const configuredUrl = configured ? validatedHttpUrl(configured) : null;
  return configuredUrl?.origin ?? new URL(request.url).origin;
}

export function getPublicBaseUrl(request: Request): string {
  const configured = getOptionalRuntimeValue("APP_BASE_URL");
  const configuredUrl = configured ? validatedHttpUrl(configured) : null;
  if (configuredUrl) {
    return `${configuredUrl.origin}${configuredUrl.pathname.replace(/\/+$/, "")}`;
  }
  return getPublicOrigin(request);
}

export function hasAllowedOrigin(request: Request): boolean {
  const requestOrigin = request.headers.get("origin");
  if (!requestOrigin) return false;

  const upstreamOrigin = new URL(request.url).origin;
  return (
    requestOrigin === upstreamOrigin ||
    requestOrigin === getPublicOrigin(request)
  );
}
