import { NextRequest, NextResponse } from 'next/server';
import { getSyllabusCollection } from '../../../lib/mongodb';
import { Syllabus } from '../../../lib/models/Syllabus';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const syllabusCollection = await getSyllabusCollection();
    const syllabus = await syllabusCollection.find({ userId }).toArray();

    return NextResponse.json(syllabus);
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subject, totalChapters, completedChapters } = body;

    if (!userId || !subject) {
      return NextResponse.json({ error: 'User ID and subject are required' }, { status: 400 });
    }

    const syllabusCollection = await getSyllabusCollection();
    const newSyllabus = {
      userId,
      subject,
      totalChapters: totalChapters || 0,
      completedChapters: completedChapters || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await syllabusCollection.insertOne(newSyllabus);

    return NextResponse.json({ ...newSyllabus, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating syllabus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}