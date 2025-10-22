import { NextRequest, NextResponse } from 'next/server';
import { NoteModel } from '@/lib/models/Note';
import { getSecurityHeaders } from '@/lib/auth-edge';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401, headers: getSecurityHeaders() });
    }

    const body = await request.json();
    const { title, content, color } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (color !== undefined) updateData.color = color;

    const resolvedParams = await params;
    const result = await NoteModel.updateById(userId, resolvedParams.id, updateData);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.note }, { headers: getSecurityHeaders() });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400, headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401, headers: getSecurityHeaders() });
    }

    const resolvedParams = await params;
    const success = await NoteModel.deleteById(userId, resolvedParams.id);

    if (success) {
      return NextResponse.json({ success: true, message: 'Note deleted successfully' }, { headers: getSecurityHeaders() });
    }

    return NextResponse.json({ success: false, error: 'Note not found or unauthorized' }, { status: 404, headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error deleting note:', error);
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