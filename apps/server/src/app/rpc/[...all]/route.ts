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

const handler = new RPCHandler(appRouter, {
  plugins: [
    new CORSPlugin({
      origin: (origin) => {
        const allowedOrigins = getAllowedOrigins();

        // Debug logging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('oRPC CORS Debug:', {
            origin,
            allowedOrigins,
            isAllowed: origin ? allowedOrigins.includes(origin) : false,
          });
        }

        // Allow the origin if it's in our allowed list
        if (origin && allowedOrigins.includes(origin)) {
          return origin;
        }

        // Allow wildcard if explicitly configured and credentials are disabled
        if (
          origin &&
          process.env.CORS_ORIGIN?.split(',').includes('*') &&
          !process.env.CORS_ALLOW_CREDENTIALS
        ) {
          return '*';
        }

        return null; // Reject the origin
      },
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
      maxAge: 86_400, // 24 hours
    }),
  ],
});

async function handleRequest(req: NextRequest) {
  const { response } = await handler.handle(req, {
    prefix: '/rpc',
    context: {},
  });

  return response ?? new Response('Not found', { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
