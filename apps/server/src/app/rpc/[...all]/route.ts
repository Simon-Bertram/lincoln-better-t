import { RPCHandler } from '@orpc/server/fetch';
import { CORSPlugin } from '@orpc/server/plugins';
import type { NextRequest } from 'next/server';
import { appRouter } from '@/routers';

// Define allowed origins
function getAllowedOrigins() {
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  const defaultAllowedOrigins = isDevelopment
    ? ['http://localhost:3000', 'http://localhost:3001']
    : [
        'https://lincoln-better-t.vercel.app',
        'https://lincoln-better-t-web.vercel.app',
        'https://lincoln-better-t-git-main-lincoln-better-t.vercel.app', // Vercel preview URLs
        'https://lincoln-better-t-web-git-main-lincoln-better-t.vercel.app',
      ];

  return [...allowedOrigins, ...defaultAllowedOrigins];
}

// Debug logging function
function debugLog(message: string, data?: Record<string, unknown>) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.CORS_DEBUG === 'true'
  ) {
    const logMessage = `[CORS DEBUG] ${message}${data ? `\n${JSON.stringify(data, null, 2)}` : ''}`;
    // Use process.stdout.write for server-side logging
    process.stdout.write(`${logMessage}\n`);
  }
}

// Configure CORS plugin
const corsPlugin = new CORSPlugin({
  origin: (origin) => {
    const allowedOrigins = getAllowedOrigins();

    debugLog('=== CORS Origin Validation ===', {
      requestOrigin: origin,
      allowedOrigins,
      nodeEnv: process.env.NODE_ENV,
      corsDebug: process.env.CORS_DEBUG,
      timestamp: new Date().toISOString(),
    });

    // TEMPORARY: Allow all origins for debugging (REMOVE IN PRODUCTION)
    if (process.env.CORS_DEBUG === 'true') {
      debugLog('🚨 DEBUG MODE: Allowing all origins', { origin });
      return origin || '*';
    }

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      debugLog('✅ No origin provided, allowing with wildcard', { origin });
      return '*';
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      debugLog('✅ Origin found in allowed list', { origin, allowedOrigins });
      return origin;
    }

    // For development, allow any localhost origin
    if (
      process.env.NODE_ENV === 'development' &&
      origin.startsWith('http://localhost')
    ) {
      debugLog('✅ Development mode: allowing localhost origin', { origin });
      return origin;
    }

    // For production, be strict about origins
    debugLog('❌ Origin not allowed', { origin, allowedOrigins });
    return null;
  },
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86_400, // 24 hours
});

const handler = new RPCHandler(appRouter, {
  plugins: [corsPlugin],
});

async function handleRequest(req: NextRequest) {
  const origin = req.headers.get('origin');
  const method = req.method;
  const url = req.url;

  debugLog('=== Request Received ===', {
    method,
    url,
    origin,
    userAgent: req.headers.get('user-agent'),
    referer: req.headers.get('referer'),
    timestamp: new Date().toISOString(),
  });

  const { response } = await handler.handle(req, {
    prefix: '/rpc',
    context: {},
  });

  if (!response) {
    debugLog('❌ No response from handler', { method, url, origin });
    return new Response('Not found', { status: 404 });
  }

  // Log response details
  debugLog('=== Response Generated ===', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    origin,
    method,
    url,
  });

  return response;
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
