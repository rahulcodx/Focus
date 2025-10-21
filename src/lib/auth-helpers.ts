import { NextRequest } from 'next/server';
import { verifyTokenEdge } from './auth-edge';

/**
 * Extract and verify user ID from request
 * Tries x-user-id header first (set by middleware), then verifies token directly
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  // Try to get userId from header first (set by middleware)
  let userId = request.headers.get('x-user-id');
  
  if (userId) {
    return userId;
  }
  
  // If no header, verify token directly
  const authHeader = request.headers.get('authorization');
  const token = request.cookies.get('auth-token')?.value || 
                (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader);
  
  if (!token) {
    return null;
  }
  
  const payload = await verifyTokenEdge(token);
  if (!payload) {
    return null;
  }
  
  return payload.userId;
}
