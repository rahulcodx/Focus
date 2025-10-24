import { NextRequest, NextResponse } from 'next/server';
import { getStudyLogsCollection } from '../../../lib/mongodb';
import { StudyLog } from '../../../lib/models/StudyLog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date'); // YYYY-MM-DD

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const studyLogsCollection = await getStudyLogsCollection();
    const query: any = { userId };
    if (date) {
      query.date = date;
    }

    const studyLogs = await studyLogsCollection.find(query).toArray();

    return NextResponse.json(studyLogs);
  } catch (error) {
    console.error('Error fetching study logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subject, duration, date } = body;

    if (!userId || !subject || !duration || !date) {
      return NextResponse.json({ error: 'User ID, subject, duration, and date are required' }, { status: 400 });
    }

    const studyLogsCollection = await getStudyLogsCollection();
    const newStudyLog = {
      userId,
      subject,
      duration,
      date,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await studyLogsCollection.insertOne(newStudyLog);

    return NextResponse.json({ ...newStudyLog, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating study log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}