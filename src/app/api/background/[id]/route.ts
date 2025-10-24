import { NextRequest, NextResponse } from 'next/server';
import { getBackgroundsCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { url, type } = body;

    const backgroundsCollection = await getBackgroundsCollection();
    const result = await backgroundsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...(url !== undefined && { url }),
          ...(type !== undefined && { type }),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Background not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Background updated successfully' });
  } catch (error) {
    console.error('Error updating background:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backgroundsCollection = await getBackgroundsCollection();
    const result = await backgroundsCollection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Background not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Background deleted successfully' });
  } catch (error) {
    console.error('Error deleting background:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}