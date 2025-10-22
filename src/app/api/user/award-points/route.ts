import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/lib/auth-edge';
import { getUserIdFromRequest } from '@/lib/auth-helpers';
import { UserModel } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const points = Number(body?.points ?? 0);
    const reason = typeof body?.reason === 'string' ? body.reason : 'Activity';

    if (!Number.isFinite(points) || points <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid points value' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    const currentPoints = user.stats?.points ?? 0;
    const newPoints = currentPoints + points;
    const currentLevel = user.stats?.level ?? 1;
    // Simple leveling: +1 level per 500 points
    const computedLevel = Math.max(1, Math.floor(newPoints / 500) + 1);

    const success = await UserModel.updateStats(userId, {
      ...user.stats,
      points: newPoints,
      level: computedLevel,
    });

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update points' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, data: { points: newPoints, level: computedLevel, reason } },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error awarding points:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        ...getSecurityHeaders(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}


