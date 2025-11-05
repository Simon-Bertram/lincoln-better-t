import type { NextRequest } from "next/server";

// Regex patterns for IP validation (defined at top level for performance)
const IPV4_REGEX =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

/**
 * Extracts the real client IP address from request headers
 * Handles various proxy scenarios (Vercel, Cloudflare, etc.)
 * @param request - The incoming request
 * @returns The client IP address or 'unknown' if not found
 */
function getClientIP(request: NextRequest): string {
  // Check various headers that proxies use to forward the real IP
  const headers = [
    "x-forwarded-for", // Most common proxy header
    "x-real-ip", // Nginx proxy
    "x-client-ip", // Apache proxy
    "cf-connecting-ip", // Cloudflare
    "x-cluster-client-ip", // Cluster environments
    "x-forwarded", // Alternative forwarded header
    "forwarded-for", // Alternative forwarded header
    "forwarded", // RFC 7239 standard
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(",")[0].trim();

      // Validate IP format (basic validation)
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }

  // Fallback to connection remote address if available
  const connectionIP =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-vercel-ip-country");

  if (connectionIP && isValidIP(connectionIP)) {
    return connectionIP;
  }

  return "unknown";
}

/**
 * Basic IP address validation
 * @param ip - IP address to validate
 * @returns True if IP appears valid
 */
function isValidIP(ip: string): boolean {
  if (!ip || typeof ip !== "string") {
    return false;
  }

  // Remove any port numbers
  const cleanIP = ip.split(":")[0];

  return IPV4_REGEX.test(cleanIP) || IPV6_REGEX.test(cleanIP);
}

/**
 * Creates the request context with client information
 * @param req - The incoming Next.js request
 * @returns Context object with client information
 */
export function createContext(req: NextRequest) {
  const clientIP = getClientIP(req);

  return {
    request: req,
    clientIP,
    userAgent: req.headers.get("user-agent") || "unknown",
    origin: req.headers.get("origin") || "unknown",
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
