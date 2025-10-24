import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';
import type { User, PublicUser } from '@/lib/models/User';
import { signAuthToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const usersCol = await getUsersCollection();
    const user = (await usersCol.findOne({ email: email.toLowerCase() })) as unknown as User | null;
    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signAuthToken({ userId: String(user._id), email: user.email });
    const publicUser: PublicUser = {
      _id: String(user._id),
      email: user.email,
      name: user.name,
      points: user.points ?? 0,
    };

    return NextResponse.json({ success: true, user: publicUser, token }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
