import { RPCHandler } from '@orpc/server/fetch';
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
        // Add any other Vercel deployment URLs that might be used
        'https://lincoln-better-t-web-git-main-lincoln-better-t.vercel.app',
      ];

  return [...allowedOrigins, ...defaultAllowedOrigins];
}

const handler = new RPCHandler(appRouter);

function addCorsHeaders(response: Response, origin: string | null): Response {
  const allowedOrigins = getAllowedOrigins();

  // Create a new response with CORS headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  // Add CORS headers according to MDN documentation
  if (origin && allowedOrigins.includes(origin)) {
    newResponse.headers.set('Access-Control-Allow-Origin', origin);
    newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (
    origin &&
    process.env.CORS_ORIGIN?.split(',').includes('*') &&
    !process.env.CORS_ALLOW_CREDENTIALS
  ) {
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
  } else if (origin) {
    // For debugging: temporarily allow any origin to identify the issue
    // TODO: Remove this in production and add the correct origin to allowedOrigins
    newResponse.headers.set('Access-Control-Allow-Origin', origin);
    newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  newResponse.headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  newResponse.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  newResponse.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return newResponse;
}

async function handleRequest(req: NextRequest) {
  const origin = req.headers.get('origin');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    const preflightResponse = new Response(null, { status: 200 });
    return addCorsHeaders(preflightResponse, origin);
  }

  const { response } = await handler.handle(req, {
    prefix: '/rpc',
    context: {},
  });

  if (!response) {
    return new Response('Not found', { status: 404 });
  }

  return addCorsHeaders(response, origin);
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
