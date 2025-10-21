import { SignJWT, jwtVerify } from 'jose';

// Types
export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Convert string secret to Uint8Array for Web Crypto API
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET);
}

// Convert expires in string to seconds
function getExpirationTime(expiresIn: string): string {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) return '7d';

  const [, value, unit] = match;
  const numValue = parseInt(value, 10);

  switch (unit) {
    case 's': return `${numValue}s`;
    case 'm': return `${numValue * 60}s`;
    case 'h': return `${numValue * 3600}s`;
    case 'd': return `${numValue * 24 * 3600}s`;
    default: return '604800s'; // 7 days in seconds
  }
}

// Edge-compatible JWT utilities
export async function generateTokenEdge(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  try {
    const secret = getSecretKey();
    const expirationTime = getExpirationTime(JWT_EXPIRES_IN);

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer('planly-app')
      .setAudience('planly-users')
      .setExpirationTime(expirationTime)
      .sign(secret);

    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
}

export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getSecretKey();

    const { payload } = await jwtVerify(token, secret, {
      issuer: 'planly-app',
      audience: 'planly-users',
    });

    return payload as JWTPayload;
  } catch (error) {
    console.log('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

// Validation utilities (Edge-compatible)
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateName(name: string): boolean {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
}

// Rate limiting helper (Edge-compatible with Map instead of external cache)
const attempts: Map<string, { count: number; resetTime: number }> = new Map();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const attempt = attempts.get(identifier);

  if (!attempt || now > attempt.resetTime) {
    // Reset or create new attempt record
    attempts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (attempt.count >= maxAttempts) {
    return false; // Rate limited
  }

  // Increment attempt count
  attempt.count++;
  return true;
}

// Clean up expired rate limit entries periodically
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, attempt] of attempts.entries()) {
    if (now > attempt.resetTime) {
      attempts.delete(key);
    }
  }
}

// Security headers helper
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  };
}
