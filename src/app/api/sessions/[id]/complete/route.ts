import { NextRequest, NextResponse } from 'next/server';
import { SessionModel } from '@/lib/models/Session';
import { getSecurityHeaders } from '@/lib/auth-edge';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401, headers: getSecurityHeaders() });
    }

    const resolvedParams = await params;
    const result = await SessionModel.complete(userId, resolvedParams.id);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.session }, { headers: getSecurityHeaders() });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400, headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}