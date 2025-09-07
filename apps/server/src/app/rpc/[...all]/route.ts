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
        // Add any other Vercel deployment URLs that might be used
        'https://lincoln-better-t-web-git-main-lincoln-better-t.vercel.app',
      ];

  return [...allowedOrigins, ...defaultAllowedOrigins];
}

// Configure CORS plugin
const corsPlugin = new CORSPlugin({
  origin: (origin) => {
    const allowedOrigins = getAllowedOrigins();

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return '*';
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return origin;
    }

    // For development, allow any localhost origin
    if (
      process.env.NODE_ENV === 'development' &&
      origin.startsWith('http://localhost')
    ) {
      return origin;
    }

    // For production, be strict about origins
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
  const { response } = await handler.handle(req, {
    prefix: '/rpc',
    context: {},
  });

  if (!response) {
    return new Response('Not found', { status: 404 });
  }

  return response;
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
