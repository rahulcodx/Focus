import { NextRequest, NextResponse } from 'next/server';
import { getTasksCollection } from '../../../lib/mongodb';
import { Task } from '../../../lib/models/Task';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const tasksCollection = await getTasksCollection();
    const tasks = await tasksCollection.find({ userId }).toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, text } = body;

    if (!userId || !text) {
      return NextResponse.json({ error: 'User ID and text are required' }, { status: 400 });
    }

    const tasksCollection = await getTasksCollection();
    const newTask = {
      userId,
      text,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await tasksCollection.insertOne(newTask);

    return NextResponse.json({ ...newTask, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}