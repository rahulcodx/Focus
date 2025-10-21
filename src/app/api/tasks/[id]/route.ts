import { NextRequest, NextResponse } from 'next/server';
import { TaskModel } from '@/lib/models/Task';
import { getSecurityHeaders } from '@/lib/auth-edge';

// PUT /api/tasks/[id] - Update a task
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const taskId = params.id;
    const body = await request.json();
    const { title, description, completed, priority, category, dueDate } = body;

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || '';
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category?.trim() || '';
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const result = await TaskModel.updateById(userId, taskId, updateData);

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.task },
        { headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const taskId = params.id;
    const success = await TaskModel.deleteById(userId, taskId);

    if (success) {
      return NextResponse.json(
        { success: true, message: 'Task deleted successfully' },
        { headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Task not found or unauthorized' },
      { status: 404, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}