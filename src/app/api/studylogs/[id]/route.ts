import { NextRequest, NextResponse } from 'next/server';
import { getStudyLogsCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { subject, duration, date } = body;

    const studyLogsCollection = await getStudyLogsCollection();
    const result = await studyLogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(subject !== undefined && { subject }),
          ...(duration !== undefined && { duration }),
          ...(date !== undefined && { date }),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Study log not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Study log updated successfully' });
  } catch (error) {
    console.error('Error updating study log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const studyLogsCollection = await getStudyLogsCollection();
    const result = await studyLogsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Study log not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Study log deleted successfully' });
  } catch (error) {
    console.error('Error deleting study log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}