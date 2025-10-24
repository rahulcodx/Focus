import { NextRequest, NextResponse } from 'next/server';
import { getSyllabusCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { subject, totalChapters, completedChapters } = body;

    const syllabusCollection = await getSyllabusCollection();
    const result = await syllabusCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...(subject !== undefined && { subject }),
          ...(totalChapters !== undefined && { totalChapters }),
          ...(completedChapters !== undefined && { completedChapters }),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Syllabus item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Syllabus updated successfully' });
  } catch (error) {
    console.error('Error updating syllabus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const syllabusCollection = await getSyllabusCollection();
    const result = await syllabusCollection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Syllabus item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Syllabus item deleted successfully' });
  } catch (error) {
    console.error('Error deleting syllabus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}