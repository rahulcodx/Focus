import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/mongodb';
import { verifyAuthToken } from '@/lib/auth';
import type { PublicUser } from '@/lib/models/User';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyAuthToken(token);
    const usersCol = await getUsersCollection();
    const user = await usersCol.findOne({ _id: new ObjectId(payload.userId) });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const publicUser: PublicUser = {
      _id: String(user._id),
      email: user.email,
      name: user.name,
      points: user.points ?? 0,
    };

    return NextResponse.json({ success: true, user: publicUser }, { status: 200 });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}