import { NextRequest, NextResponse } from 'next/server';
import { TaskModel } from '@/lib/models/Task';
import { getSecurityHeaders, verifyTokenEdge } from '@/lib/auth-edge';

// GET /api/tasks - Get all tasks for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Try to get userId from header first (set by middleware)
    let userId = request.headers.get('x-user-id');
    
    // If no header, verify token directly
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      const token = request.cookies.get('auth-token')?.value || 
                    (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader);
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401, headers: getSecurityHeaders() }
        );
      }
      
      const payload = await verifyTokenEdge(token);
      if (!payload) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401, headers: getSecurityHeaders() }
        );
      }
      
      userId = payload.userId;
    }

    // Parse query parameters
    const url = new URL(request.url);
    const completed = url.searchParams.get('completed');
    const category = url.searchParams.get('category');

    const filter: any = {};
    if (completed !== null) {
      filter.completed = completed === 'true';
    }
    if (category) {
      filter.category = category;
    }

    const tasks = await TaskModel.getByUserId(userId, filter);

    return NextResponse.json(
      { success: true, data: tasks },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    // Try to get userId from header first (set by middleware)
    let userId = request.headers.get('x-user-id');
    
    // If no header, verify token directly
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      const token = request.cookies.get('auth-token')?.value || 
                    (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader);
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401, headers: getSecurityHeaders() }
        );
      }
      
      const payload = await verifyTokenEdge(token);
      if (!payload) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401, headers: getSecurityHeaders() }
        );
      }
      
      userId = payload.userId;
    }

    const body = await request.json();
    const { title, description, priority, category, dueDate } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Task title is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const taskData = {
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',
      category: category?.trim() || '',
      dueDate: dueDate ? new Date(dueDate) : undefined
    };

    const result = await TaskModel.create(userId, taskData);

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.task },
        { status: 201, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error creating task:', error);
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