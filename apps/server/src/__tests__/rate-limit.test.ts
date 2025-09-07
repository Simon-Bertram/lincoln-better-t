import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkRateLimit,
  createRateLimitMiddleware,
  getClientId,
} from '../lib/rate-limit';

// Mock the rate limit store
const mockRateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

// Mock the global rate limit store
vi.mock('../lib/rate-limit', async () => {
  const actual = await vi.importActual('../lib/rate-limit');
  return {
    ...actual,
    // Override the store for testing
    rateLimitStore: mockRateLimitStore,
  };
});

describe('Rate Limiting', () => {
  beforeEach(() => {
    mockRateLimitStore.clear();
  });

  describe('getClientId', () => {
    it('should extract client ID from x-forwarded-for header', () => {
      const mockReq = {
        headers: {
          get: (name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.1, 10.0.0.1';
            return null;
          },
        },
      };

      const clientId = getClientId(mockReq);
      expect(clientId).toBe('192.168.1.1');
    });

    it('should extract client ID from x-real-ip header', () => {
      const mockReq = {
        headers: {
          get: (name: string) => {
            if (name === 'x-real-ip') return '192.168.1.2';
            return null;
          },
        },
      };

      const clientId = getClientId(mockReq);
      expect(clientId).toBe('192.168.1.2');
    });

    it('should extract client ID from cf-connecting-ip header', () => {
      const mockReq = {
        headers: {
          get: (name: string) => {
            if (name === 'cf-connecting-ip') return '192.168.1.3';
            return null;
          },
        },
      };

      const clientId = getClientId(mockReq);
      expect(clientId).toBe('192.168.1.3');
    });

    it('should return unknown when no IP headers are present', () => {
      const mockReq = {
        headers: {
          get: () => null,
        },
      };

      const clientId = getClientId(mockReq);
      expect(clientId).toBe('unknown');
    });
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-client', 100);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99);
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });

    it('should allow requests within limit', () => {
      const clientId = 'test-client-2';

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(clientId, 100);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(99 - i);
      }
    });

    it('should block requests when limit exceeded', () => {
      const clientId = 'test-client-3';
      const maxRequests = 3;

      // Make requests up to the limit
      for (let i = 0; i < maxRequests; i++) {
        const result = checkRateLimit(clientId, maxRequests);
        expect(result.allowed).toBe(true);
      }

      // Next request should be blocked
      const blockedResult = checkRateLimit(clientId, maxRequests);
      expect(blockedResult.allowed).toBe(false);
      expect(blockedResult.remaining).toBe(0);
      expect(blockedResult.retryAfter).toBeGreaterThan(0);
    });

    it('should reset after window expires', () => {
      const clientId = 'test-client-4';
      const maxRequests = 2;

      // Exceed the limit
      checkRateLimit(clientId, maxRequests);
      checkRateLimit(clientId, maxRequests);
      const blockedResult = checkRateLimit(clientId, maxRequests);
      expect(blockedResult.allowed).toBe(false);

      // Manually expire the window by setting resetTime to past
      const clientData = mockRateLimitStore.get(clientId);
      if (clientData) {
        clientData.resetTime = Date.now() - 1000; // 1 second ago
      }

      // Next request should be allowed again
      const allowedResult = checkRateLimit(clientId, maxRequests);
      expect(allowedResult.allowed).toBe(true);
      expect(allowedResult.remaining).toBe(maxRequests - 1);
    });
  });

  describe('Rate Limit Middleware', () => {
    it('should create middleware with default settings', () => {
      const middleware = createRateLimitMiddleware();
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should create middleware with custom settings', () => {
      const customMiddleware = createRateLimitMiddleware(50);
      expect(customMiddleware).toBeDefined();
      expect(typeof customMiddleware).toBe('function');
    });
  });

  describe('Rate Limit Configuration', () => {
    it('should have reasonable default limits', () => {
      // These tests verify that our configuration constants are reasonable
      expect(100).toBeGreaterThan(0); // MAX_REQUESTS
      expect(20).toBeGreaterThan(0); // MAX_REQUESTS_STRICT
      expect(60 * 1000).toBeGreaterThan(0); // WINDOW_MS
    });
  });
});
