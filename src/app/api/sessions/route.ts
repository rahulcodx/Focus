import { NextRequest, NextResponse } from 'next/server';
import { SessionModel } from '@/lib/models/Session';
import { getSecurityHeaders } from '@/lib/auth-edge';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401, headers: getSecurityHeaders() });
    }

    const body = await request.json();
    const { type, duration } = body;

    if (!type || !duration) {
      return NextResponse.json({ success: false, error: 'Session type and duration are required' }, { status: 400, headers: getSecurityHeaders() });
    }

    const result = await SessionModel.create(userId, { type, duration });

    if (result.success) {
      return NextResponse.json({ success: true, data: result.session }, { status: 201, headers: getSecurityHeaders() });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400, headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}