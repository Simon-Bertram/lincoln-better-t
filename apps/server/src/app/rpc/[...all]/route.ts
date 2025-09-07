import { RPCHandler } from '@orpc/server/fetch';
import type { NextRequest } from 'next/server';
import { appRouter } from '@/routers';

const handler = new RPCHandler(appRouter);

function addCorsHeaders(response: Response, origin: string | null): Response {
  // Define allowed origins
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

  const allAllowedOrigins = [...allowedOrigins, ...defaultAllowedOrigins];

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('RPC CORS Debug:', {
      origin,
      allowedOrigins: allAllowedOrigins,
      isAllowed: origin ? allAllowedOrigins.includes(origin) : false,
    });
  }

  // Create a new response with CORS headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  // Add CORS headers
  if (origin && allAllowedOrigins.includes(origin)) {
    newResponse.headers.set('Access-Control-Allow-Origin', origin);
    newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (
    origin &&
    allowedOrigins.includes('*') &&
    !process.env.CORS_ALLOW_CREDENTIALS
  ) {
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
  }

  newResponse.headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  newResponse.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  return newResponse;
}

async function handleRequest(req: NextRequest) {
  const origin = req.headers.get('origin');

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
