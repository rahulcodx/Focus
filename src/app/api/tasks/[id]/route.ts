import { NextRequest, NextResponse } from 'next/server';
import { TaskModel } from '@/lib/models/Task';
import { getSecurityHeaders } from '@/lib/auth-edge';
import { UserModel } from '@/lib/models/User';

// PUT /api/tasks/[id] - Update a task
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const resolvedParams = await params;
    const taskId = resolvedParams.id;
    const body = await request.json();
    const { title, description, completed, priority, category, dueDate } = body;

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || '';
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category?.trim() || '';
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const prevTaskList = await TaskModel.getByUserId(userId, {});
    const prevTask = prevTaskList.find(t => t._id?.toString() === taskId);

    const result = await TaskModel.updateById(userId, taskId, updateData);

    if (result.success) {
      // Award points on first-time completion
      try {
        const becameCompleted = updateData.completed === true && prevTask?.completed !== true;
        if (becameCompleted) {
          const user = await UserModel.findById(userId);
          if (user) {
            const currentPoints = user.stats?.points ?? 0;
            const newPoints = currentPoints + 20; // award 20 pts per task completed
            const computedLevel = Math.max(1, Math.floor(newPoints / 500) + 1);
            await UserModel.updateStats(userId, {
              ...user.stats,
              points: newPoints,
              level: computedLevel,
              completedTasks: (user.stats?.completedTasks ?? 0) + 1,
              totalTasks: Math.max(user.stats?.totalTasks ?? 0, (user.stats?.totalTasks ?? 0))
            });
          }
        }
      } catch (e) {
        console.error('Failed to award task completion points:', e);
      }

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
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const resolvedParams = await params;
    const taskId = resolvedParams.id;
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