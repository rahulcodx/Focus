import { NextRequest, NextResponse } from 'next/server';
import { getTasksCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, completed } = body;

    const tasksCollection = await getTasksCollection();
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(text !== undefined && { text }),
          ...(completed !== undefined && { completed }),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tasksCollection = await getTasksCollection();
    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}