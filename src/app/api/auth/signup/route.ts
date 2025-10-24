import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';
import type { User, PublicUser } from '@/lib/models/User';
import { signAuthToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body as { email?: string; password?: string; name?: string };

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const usersCol = await getUsersCollection();
    
    // Check if user already exists
    const existingUser = await usersCol.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists with this email' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new user
    const newUser: Omit<User, '_id'> = {
      email: email.toLowerCase(),
      passwordHash,
      name: name || '',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCol.insertOne(newUser);
    const userId = String(result.insertedId);

    // Generate JWT token
    const token = signAuthToken({ userId, email: newUser.email });
    
    const publicUser: PublicUser = {
      _id: userId,
      email: newUser.email,
      name: newUser.name,
      points: newUser.points,
    };

    return NextResponse.json({ success: true, user: publicUser, token }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
