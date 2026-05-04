import type { PaletteColor } from "@farcaster/snap";

export function getBaseUrl(request: Request): string {
  const fromEnv = process.env.SNAP_PUBLIC_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostHeader = request.headers.get("host");
  const host = (forwardedHost ?? hostHeader)?.split(",")[0].trim();
  const isLoopback =
    host !== undefined &&
    /^(localhost|127\.0\.0\.1|\[::1\]|::1)(:\d+)?$/.test(host);
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = forwardedProto
    ? forwardedProto.split(",")[0].trim().toLowerCase()
    : isLoopback
      ? "http"
      : "https";
  if (host) return `${proto}://${host}`;
  return `http://localhost:${process.env.PORT ?? "3003"}`;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatCategory(cat: string): string {
  if (!cat) return "Event";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function categoryAccent(cat: string): PaletteColor {
  const map: Record<string, PaletteColor> = {
    concert: "purple",
    party: "pink",
    sports: "green",
    food: "amber",
  };
  return map[cat.toLowerCase()] ?? "blue";
}
