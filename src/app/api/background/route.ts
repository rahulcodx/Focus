import { NextRequest, NextResponse } from 'next/server';
import { getBackgroundsCollection } from '../../../lib/mongodb';
import { Background } from '../../../lib/models/Background';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const backgroundsCollection = await getBackgroundsCollection();
    const backgrounds = await backgroundsCollection.find({ userId }).toArray();

    return NextResponse.json(backgrounds);
  } catch (error) {
    console.error('Error fetching backgrounds:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, url, type } = body;

    if (!userId || !url || !type) {
      return NextResponse.json({ error: 'User ID, URL, and type are required' }, { status: 400 });
    }

    const backgroundsCollection = await getBackgroundsCollection();
    const newBackground = {
      userId,
      url,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await backgroundsCollection.insertOne(newBackground);

    return NextResponse.json({ ...newBackground, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating background:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}