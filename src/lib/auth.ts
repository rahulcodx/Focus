import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

export async function signAuthToken(payload: AuthTokenPayload): Promise<string> {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .setIssuedAt()
    .sign(secret);
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload> {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as AuthTokenPayload;
}


