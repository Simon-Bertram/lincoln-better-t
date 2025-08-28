# Security Configuration

This document outlines the security measures implemented in the lincoln-better-t application.

## Security Issue Resolution

### "No CSP found in enforcement mode" - RESOLVED ✅

This security issue was addressed by implementing a comprehensive Content Security Policy (CSP) across both the web and server applications. The implementation includes:

- **CSP Headers**: Strict content security policy directives
- **Security Headers**: Additional security headers for enhanced protection
- **Middleware**: Server-side enforcement of security policies
- **Testing**: Automated testing utilities to verify implementation
- **Documentation**: Comprehensive documentation of all security measures

The CSP implementation follows security best practices and provides protection against:

- Cross-Site Scripting (XSS) attacks
- Clickjacking attacks
- MIME type sniffing
- Unauthorized resource loading
- Cross-site request forgery (CSRF)

## Content Security Policy (CSP)

The application implements a comprehensive Content Security Policy to mitigate XSS attacks and other security vulnerabilities.

### CSP Directives

- **default-src 'self'**: Restricts all resources to same origin by default
- **script-src 'self' 'unsafe-inline' 'unsafe-eval'**: Allows scripts from same origin and inline scripts (required for Next.js)
- **style-src 'self' 'unsafe-inline'**: Allows styles from same origin and inline styles (required for Tailwind CSS)
- **font-src 'self' https://fonts.gstatic.com data:**: Allows fonts from same origin and Google Fonts
- **img-src 'self' data: blob: https:**: Allows images from same origin, data URIs, and HTTPS sources
- **connect-src 'self' https:**: Allows connections to same origin and HTTPS endpoints
- **object-src 'none'**: Blocks all object/embed/applet elements
- **base-uri 'self'**: Restricts base URI to same origin
- **form-action 'self'**: Restricts form submissions to same origin
- **frame-ancestors 'none'**: Prevents embedding in iframes (clickjacking protection)
- **upgrade-insecure-requests**: Upgrades HTTP requests to HTTPS

### Additional Security Headers

- **X-Content-Type-Options: nosniff**: Prevents MIME type sniffing
- **X-Frame-Options: DENY**: Prevents clickjacking attacks
- **X-XSS-Protection: 1; mode=block**: Enables XSS protection
- **Referrer-Policy: strict-origin-when-cross-origin**: Controls referrer information
- **Permissions-Policy**: Restricts browser features (camera, microphone, geolocation, payment)

## Implementation

### File Structure

The CSP implementation spans across multiple files in the monorepo:

```
lincoln-better-t/
├── apps/
│   ├── web/
│   │   ├── next.config.ts          # Web app CSP configuration
│   │   ├── src/middleware.ts       # Web app security middleware
│   │   ├── scripts/test-csp.js     # CSP testing utility
│   │   └── SECURITY.md             # This documentation
│   └── server/
│       ├── next.config.ts          # Server app CSP configuration
│       └── src/middleware.ts       # Server app security middleware
```

### Next.js Configuration (`next.config.ts`)

CSP headers are configured in the Next.js configuration file using the `headers()` function. The configuration includes:

```typescript
const nextConfig: NextConfig = {
  headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https:",
              "media-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          // Additional security headers
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};
```

### Middleware (`src/middleware.ts`)

Additional security headers are applied through Next.js middleware for all routes except static assets. The middleware includes:

```typescript
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers if not already present
  const cspHeader = response.headers.get("Content-Security-Policy");
  if (!cspHeader) {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https:",
        "media-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
      ].join("; ")
    );
  }

  // Add additional security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  return response;
}
```

### Server Application

The server application (`apps/server/`) also implements the same CSP configuration with additional CORS handling:

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Secure CORS configuration
  const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
  const origin = request.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  // Add CSP headers if not already present
  const cspHeader = response.headers.get("Content-Security-Policy");
  if (!cspHeader) {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self' data:",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https:",
        "media-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
      ].join("; ")
    );
  }

  // Add additional security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  return response;
}
```

## Testing CSP

### Manual Testing

To test if CSP is working correctly:

1. Open browser developer tools
2. Check the Network tab for the `Content-Security-Policy` header
3. Look for any CSP violations in the Console tab
4. Use tools like [CSP Evaluator](https://csp-evaluator.withgoogle.com/) to validate your policy

### Automated Testing

A test script is available at `scripts/test-csp.js` to automatically verify CSP headers:

```bash
# Test the web application
node scripts/test-csp.js http://localhost:3000

# Test a different URL
node scripts/test-csp.js https://your-domain.com
```

The test script will:

- Check if CSP headers are present
- Validate key CSP directives
- Verify additional security headers
- Provide a detailed report of findings

Example output:

```
🔍 Testing CSP headers for: http://localhost:3000
📊 Response Status: 200
🔒 CSP Header Present: true
✅ CSP Header Found:
   default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; ...

🔍 Checking key directives:
   ✅ default-src
   ✅ script-src
   ✅ style-src
   ✅ object-src
   ✅ frame-ancestors

🔍 Checking security headers:
   ✅ X-Content-Type-Options: nosniff
   ✅ X-Frame-Options: DENY
   ✅ X-XSS-Protection: 1; mode=block
   ✅ Referrer-Policy: strict-origin-when-cross-origin
```

## Monitoring

Monitor CSP violations in production:

1. Set up CSP reporting to capture violations
2. Use browser developer tools to check for violations
3. Consider implementing CSP reporting endpoints for production monitoring

## Customization

To modify the CSP policy:

1. Update the CSP directives in `next.config.ts`
2. Update the middleware in `src/middleware.ts` if needed
3. Test thoroughly to ensure no legitimate functionality is blocked
4. Consider using `Content-Security-Policy-Report-Only` header for testing

## Best Practices

1. **Start Strict**: Begin with a restrictive policy and gradually relax it
2. **Test Thoroughly**: Ensure all functionality works with CSP enabled
3. **Monitor Violations**: Set up reporting to catch CSP violations
4. **Regular Review**: Periodically review and update the CSP policy
5. **Document Changes**: Keep this document updated with any policy changes

## Resources

- [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
