import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, backgroundUrl } = body;

    if (!userId || !backgroundUrl) {
      return NextResponse.json({ error: 'User ID and background URL are required' }, { status: 400 });
    }

    const usersCollection = await getUsersCollection();
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          backgroundUrl,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Background updated successfully' });
  } catch (error) {
    console.error('Error updating background:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}