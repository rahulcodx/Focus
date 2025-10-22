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

    const body = await request.json().catch(() => ({}));
    const seconds = Math.max(0, Math.min(3600, Number(body?.seconds ?? 60)));

    if (!Number.isFinite(seconds) || seconds <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid seconds value' },
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

    const priorTotal = user.stats?.totalFocusTime ?? 0;
    const updatedTotal = priorTotal + seconds;

    // Track live focus accumulated for today to reflect in "today" and streaks before session completion
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const lastDate = (user as any).stats?.liveTodayDate as string | undefined;
    const priorLive = (user as any).stats?.liveTodayFocusTime ?? 0;
    const liveTodayFocusTime = lastDate === todayStr ? priorLive + seconds : seconds;

    const ok = await UserModel.updateStats(userId, {
      ...user.stats,
      totalFocusTime: updatedTotal,
      liveTodayFocusTime,
      liveTodayDate: todayStr,
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to update focus time' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, data: { totalFocusTime: updatedTotal } },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error incrementing focus time:', error);
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


