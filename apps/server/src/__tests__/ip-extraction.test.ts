import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { createContext } from '../lib/context';
import { checkRateLimitWithContext } from '../lib/rate-limit';

describe('IP Extraction and Rate Limiting', () => {
  it('should extract real IP from x-forwarded-for header', () => {
    const request = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'x-forwarded-for': '192.168.1.100, 10.0.0.1',
        'user-agent': 'Mozilla/5.0 (Test Browser)',
        origin: 'http://localhost:3000',
      },
    });

    const context = createContext(request);

    expect(context.clientIP).toBe('192.168.1.100');
    expect(context.userAgent).toBe('Mozilla/5.0 (Test Browser)');
    expect(context.origin).toBe('http://localhost:3000');
  });

  it('should extract IP from x-real-ip header', () => {
    const request = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'x-real-ip': '203.0.113.1',
        'user-agent': 'Test Agent',
        origin: 'https://example.com',
      },
    });

    const context = createContext(request);

    expect(context.clientIP).toBe('203.0.113.1');
  });

  it('should fallback to user agent + origin when IP is unknown', () => {
    const request = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        origin: 'https://example.com',
      },
    });

    const context = createContext(request);

    expect(context.clientIP).toBe('unknown');
    expect(context.userAgent).toBe(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );
    expect(context.origin).toBe('https://example.com');
  });

  it('should handle rate limiting with real IP addresses', () => {
    const request = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'x-forwarded-for': '192.168.1.200',
        'user-agent': 'Test Browser',
        origin: 'http://localhost:3000',
      },
    });

    const context = createContext(request);

    // First request should be allowed
    const result1 = checkRateLimitWithContext(context, 2); // Very low limit for testing
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(1);

    // Second request should be allowed
    const result2 = checkRateLimitWithContext(context, 2);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(0);

    // Third request should be rate limited
    const result3 = checkRateLimitWithContext(context, 2);
    expect(result3.allowed).toBe(false);
    expect(result3.remaining).toBe(0);
    expect(result3.retryAfter).toBeDefined();
  });

  it('should handle different IPs separately', () => {
    const request1 = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'x-forwarded-for': '192.168.1.100',
        'user-agent': 'Browser 1',
        origin: 'http://localhost:3000',
      },
    });

    const request2 = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'x-forwarded-for': '192.168.1.200',
        'user-agent': 'Browser 2',
        origin: 'http://localhost:3000',
      },
    });

    const context1 = createContext(request1);
    const context2 = createContext(request2);

    // Both should be allowed since they're different IPs
    const result1 = checkRateLimitWithContext(context1, 1);
    const result2 = checkRateLimitWithContext(context2, 1);

    expect(result1.allowed).toBe(true);
    expect(result2.allowed).toBe(true);
  });

  it('should validate IP addresses correctly', () => {
    const validIPs = [
      '192.168.1.1',
      '10.0.0.1',
      '203.0.113.1',
      '::1',
      '2001:db8::1',
    ];

    const invalidIPs = [
      'not-an-ip',
      '999.999.999.999',
      '192.168.1',
      '192.168.1.1.1',
      '',
    ];

    for (const ip of validIPs) {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': ip,
          'user-agent': 'Test',
          origin: 'http://localhost:3000',
        },
      });

      const context = createContext(request);
      expect(context.clientIP).toBe(ip);
    }

    for (const ip of invalidIPs) {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': ip,
          'user-agent': 'Test',
          origin: 'http://localhost:3000',
        },
      });

      const context = createContext(request);
      expect(context.clientIP).toBe('unknown');
    }
  });
});
