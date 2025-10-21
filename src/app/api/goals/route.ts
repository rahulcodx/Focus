import { NextRequest, NextResponse } from 'next/server';
import { GoalModel } from '@/lib/models/Goal';
import { getSecurityHeaders } from '@/lib/auth-edge';
import { getUserIdFromRequest } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401, headers: getSecurityHeaders() });
    }

    const url = new URL(request.url);
    const completed = url.searchParams.get('completed');
    const category = url.searchParams.get('category');

    const filter: any = {};
    if (completed !== null) filter.completed = completed === 'true';
    if (category) filter.category = category;

    const goals = await GoalModel.getByUserId(userId, filter);
    return NextResponse.json({ success: true, data: goals }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401, headers: getSecurityHeaders() });
    }

    const body = await request.json();
    const { title, description, target, unit, category, deadline } = body;

    if (!title || !target || !unit) {
      return NextResponse.json({ success: false, error: 'Title, target, and unit are required' }, { status: 400, headers: getSecurityHeaders() });
    }

    const result = await GoalModel.create(userId, {
      title: title.trim(),
      description: description?.trim() || '',
      target: parseInt(target),
      unit: unit.trim(),
      category: category?.trim() || '',
      deadline: deadline ? new Date(deadline) : undefined
    });

    if (result.success) {
      return NextResponse.json({ success: true, data: result.goal }, { status: 201, headers: getSecurityHeaders() });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400, headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error creating goal:', error);
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