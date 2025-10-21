import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/lib/models/User';
import { generateTokenEdge, checkRateLimit, getSecurityHeaders } from '@/lib/auth-edge';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limiting (5 attempts per 15 minutes per IP)
    if (!checkRateLimit(clientIP, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many signup attempts. Please try again later.' },
        {
          status: 429,
          headers: getSecurityHeaders()
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        {
          status: 400,
          headers: getSecurityHeaders()
        }
      );
    }

    // Create user
    const result = await UserModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        {
          status: 400,
          headers: getSecurityHeaders()
        }
      );
    }

    // Generate JWT token
    const token = await generateTokenEdge({
      userId: result.user!._id!.toString(),
      email: result.user!.email,
      name: result.user!.name,
    });

    // Create response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = result.user!;

    const response = NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: userWithoutPassword,
        token,
      },
      {
        status: 201,
        headers: getSecurityHeaders()
      }
    );

    // Set HTTP-only cookie for additional security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      {
        status: 500,
        headers: getSecurityHeaders()
      }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
