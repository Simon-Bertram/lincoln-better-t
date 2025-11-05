# Security Documentation

## Overview

This document outlines the security features, best practices, and recommendations for the Lincoln Institute Directory application. The application follows a multi-layered security approach to protect sensitive historical data and ensure secure API communications.

## 🔒 Security Features Implemented

### 1. **Secure CORS Configuration**

**Location**: `apps/server/src/middleware.ts`

**Features**:

- Origin validation against allowed list
- Support for multiple origins via comma-separated environment variables
- Proper CORS headers for credentials and methods
- Prevents unauthorized cross-origin requests

**Configuration**:

```typescript
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
const origin = req.headers.get("origin");

if (origin && allowedOrigins.includes(origin)) {
  res.headers.set("Access-Control-Allow-Origin", origin);
}
```

**Environment Variable**:

```bash
# Single origin
CORS_ORIGIN=http://localhost:3001

# Multiple origins
CORS_ORIGIN=http://localhost:3001,https://yourdomain.com,https://app.yourdomain.com
```

### 2. **Security Headers**

**Location**: `apps/server/src/middleware.ts`

**Implemented Headers**:

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing attacks
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block` - XSS protection for older browsers
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` - Enforces HTTPS

### 3. **Input Validation**

**Location**: `apps/server/src/routers/index.ts`

**Features**:

- Zod schema validation for all API inputs
- Parameter bounds checking (limits, offsets, search strings)
- Type-safe validation with TypeScript integration
- Prevents injection attacks and malformed requests

**Example**:

```typescript
const getStudentsSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  search: z.string().max(200).optional(),
});
```

### 4. **Database Security**

**Location**: `apps/server/src/db/index.ts`

**Features**:

- Drizzle ORM for SQL injection protection
- Parameterized queries
- Type-safe database operations
- Connection string validation

### 5. **Error Handling**

**Location**: `apps/server/src/routers/index.ts`

**Features**:

- Comprehensive try-catch blocks
- User-friendly error messages
- No sensitive information leakage in errors
- Structured error responses

**Example**:

```typescript
try {
  const data = await query.where(whereClause).limit(limit).offset(offset);
  return { success: true, data };
} catch (error) {
  throw new Error(
    `Failed to fetch students: ${
      error instanceof Error ? error.message : "Unknown error"
    }`
  );
}
```

### 6. **Frontend Security**

**Location**: `apps/web/src/`

**Features**:

- Comprehensive error boundaries
- Input sanitization
- XSS protection through React's built-in escaping
- Secure error handling without information leakage

## 🚨 Critical Security Gaps

### 1. **Missing Authentication**

**Status**: ❌ Not Implemented

**Impact**: High - All data is publicly accessible

**Recommendation**: Implement authentication system

```typescript
// Example implementation needed
export async function createContext(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ORPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  const user = await verifyToken(token);
  return { user };
}
```

### 2. **Missing Authorization**

**Status**: ❌ Not Implemented

**Impact**: High - No role-based access control

**Recommendation**: Implement authorization middleware

```typescript
// Example implementation needed
const authorizedProcedure = publicProcedure.middleware(
  async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new ORPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }
    return next();
  }
);
```

### 3. **Rate Limiting**

**Status**: ✅ Not Required (Site is Fully Static)

**Impact**: N/A - Site is statically generated at build time

**Note**: The application is fully statically generated with `revalidate = false`. All data is embedded in the static HTML at build time, so there are no runtime API calls that would require rate limiting. The RPC endpoints are only used during the build process.
await limiter.check(ctx.req, 10, "CACHE_TOKEN");
return next();
})
.handler(async () => {
// ... handler logic
}),
};

````

### 4. **No Request Logging**

**Status**: ❌ Not Implemented

**Impact**: Low - Difficult to monitor and debug

**Recommendation**: Implement comprehensive logging

```typescript
// Example implementation needed
export const appRouter = {
  getStudents: publicProcedure
    .middleware(async ({ ctx, next }) => {
      const start = Date.now();
      const result = await next();
      const duration = Date.now() - start;

      // Log to external service
      logRequest({
        method: ctx.req.method,
        url: ctx.req.url,
        duration,
        user: ctx.user?.id,
      });

      return result;
    })
    .handler(async () => {
      // ... handler logic
    }),
};
````

## 🔧 Security Configuration

### Environment Variables

**Required**:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# CORS
CORS_ORIGIN=http://localhost:3001,https://yourdomain.com

# API
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

**Recommended**:

```bash
# Authentication
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# Logging
SENTRY_DSN=your-sentry-dsn
```

### Security Headers Configuration

The application automatically applies security headers through middleware:

```typescript
// Security headers applied to all responses
res.headers.set("X-Content-Type-Options", "nosniff");
res.headers.set("X-Frame-Options", "DENY");
res.headers.set("X-XSS-Protection", "1; mode=block");
res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
res.headers.set(
  "Strict-Transport-Security",
  "max-age=31536000; includeSubDomains"
);
```

## 📋 Security Checklist

### ✅ Implemented

- [x] Secure CORS configuration
- [x] Security headers
- [x] Input validation with Zod
- [x] Database injection protection (Drizzle ORM)
- [x] Error handling without information leakage
- [x] Frontend error boundaries
- [x] Type-safe operations

### ❌ Not Implemented (Critical)

- [ ] Authentication system
- [ ] Authorization middleware
- [ ] Request logging and monitoring
- [ ] Audit logging
- [ ] Data access controls
- [ ] API versioning

### 🔄 Recommended Improvements

- [ ] Implement JWT authentication
- [ ] Add role-based access control
- [ ] Integrate with error reporting service (Sentry)
- [ ] Add request/response logging
- [ ] Implement data anonymization for sensitive fields
- [ ] Set up automated security testing
- [ ] Create security incident response plan

## 🛡️ Data Protection

### Sensitive Data Handling

The application contains historical student records with potentially sensitive information:

**Sensitive Fields**:

- Personal names (Indian names, family names)
- Birth and death information
- Cause of death
- Burial information
- Personal comments

**Protection Measures**:

- Input validation and sanitization
- Database injection protection
- Error handling without data leakage
- CORS protection

**Recommended Additional Measures**:

- Data anonymization for public access
- Access logging for sensitive data queries
- Data retention policies
- Regular security audits

## 🔍 Security Monitoring

### Current Monitoring

- Basic error logging in development
- Frontend error boundaries
- Database error handling

### Recommended Monitoring

- External error reporting (Sentry)
- Request/response logging
- Authentication attempt logging
- Rate limit violation alerts
- Unusual access pattern detection

## 🚀 Deployment Security

### Production Checklist

- [ ] Use HTTPS only
- [ ] Set secure environment variables
- [ ] Configure proper CORS origins
- [ ] Enable security headers
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Database backup and encryption
- [ ] Access control implementation

### Environment Security

```bash
# Production environment variables
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret
```

## 📚 Security Resources

### Documentation

- [Next.js Security Documentation](https://nextjs.org/docs/advanced-features/security-headers)
- [oRPC Security Best Practices](https://orpc.dev/docs/security)
- [Drizzle ORM Security](https://orm.drizzle.team/docs/get-started-postgresql)
- [Zod Validation](https://zod.dev/)

### Tools

- [Sentry for Error Monitoring](https://sentry.io/)
- [JWT for Authentication](https://jwt.io/)
- [Helmet for Security Headers](https://helmetjs.github.io/)

## 🔄 Security Updates

### Regular Maintenance

- Keep dependencies updated
- Monitor security advisories
- Regular security audits
- Penetration testing
- Security training for developers

### Incident Response

1. **Detection**: Monitor logs and alerts
2. **Assessment**: Evaluate impact and scope
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove security threats
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Update security measures

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
