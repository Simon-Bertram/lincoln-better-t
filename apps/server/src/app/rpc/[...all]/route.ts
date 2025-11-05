import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import type { NextRequest } from "next/server";
import { createContext } from "@/lib/context";
import { appRouter } from "@/routers";

// Define allowed origins
function getAllowedOrigins() {
  const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
  const isDevelopment = process.env.NODE_ENV === "development";
  const defaultAllowedOrigins = isDevelopment
    ? ["http://localhost:3000", "http://localhost:3001"]
    : [
        "https://lincoln-better-t.vercel.app",
        "https://lincoln-better-t-web.vercel.app",
        "https://lincoln-better-t-git-main-lincoln-better-t.vercel.app", // Vercel preview URLs
        "https://lincoln-better-t-web-git-main-lincoln-better-t.vercel.app",
      ];

  return [...allowedOrigins, ...defaultAllowedOrigins];
}

// Configure CORS plugin
const corsPlugin = new CORSPlugin({
  origin: (origin) => {
    const allowedOrigins = getAllowedOrigins();

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return "*";
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return origin;
    }

    // For development, allow any localhost origin
    if (
      process.env.NODE_ENV === "development" &&
      origin.startsWith("http://localhost")
    ) {
      return origin;
    }

    // For production, be strict about origins
    return null;
  },
  allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86_400, // 24 hours
});

const handler = new RPCHandler(appRouter, {
  plugins: [corsPlugin],
});

async function handleRequest(req: NextRequest) {
  // Create context with client information for rate limiting
  const context = createContext(req);

  const { response } = await handler.handle(req, {
    prefix: "/rpc",
    context,
  });

  if (!response) {
    return new Response("Not found", { status: 404 });
  }

  return response;
}

// Handle preflight OPTIONS requests - follows Vercel's recommended pattern
export function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();

  // Determine allowed origin based on the same logic as the CORS plugin
  let allowedOrigin = "null";

  if (!origin) {
    // Allow requests with no origin (like mobile apps or curl requests)
    allowedOrigin = "*";
  } else if (allowedOrigins.includes(origin)) {
    // Check if origin is in allowed list
    allowedOrigin = origin;
  } else if (
    process.env.NODE_ENV === "development" &&
    origin.startsWith("http://localhost")
  ) {
    // For development, allow any localhost origin
    allowedOrigin = origin;
  }

  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods":
        "GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
