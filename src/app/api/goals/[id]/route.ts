import { NextRequest, NextResponse } from 'next/server';
import { GoalModel } from '@/lib/models/Goal';
import { getSecurityHeaders } from '@/lib/auth-edge';
import { getUserIdFromRequest } from '@/lib/auth-helpers';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { current, completed } = body;

    // Build update object
    const updateData: any = {};
    if (current !== undefined) {
      updateData.current = parseInt(current);
    }
    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const result = await GoalModel.updateById(userId, params.id, updateData);

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.goal },
        { headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const result = await GoalModel.deleteById(userId, params.id);

    if (result) {
      return NextResponse.json(
        { success: true, message: 'Goal deleted successfully' },
        { headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete goal' },
      { status: 400, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
