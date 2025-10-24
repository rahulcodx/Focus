import { NextRequest, NextResponse } from 'next/server';
import { getStudyLogsCollection } from '../../../../lib/mongodb';

export async function DELETE(request: NextRequest) {
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

    const result = await studyLogsCollection.deleteMany(query);

    return NextResponse.json({ message: `${result.deletedCount} study logs reset successfully` });
  } catch (error) {
    console.error('Error resetting study logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}