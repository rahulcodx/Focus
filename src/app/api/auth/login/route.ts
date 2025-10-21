import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/lib/models/User';
import { generateTokenEdge, checkRateLimit, getSecurityHeaders } from '@/lib/auth-edge';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limiting (10 attempts per 15 minutes per IP)
    if (!checkRateLimit(clientIP, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: getSecurityHeaders()
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        {
          status: 400,
          headers: getSecurityHeaders()
        }
      );
    }

    // Authenticate user
    const result = await UserModel.authenticate(email.trim().toLowerCase(), password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        {
          status: 401,
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
        message: 'Login successful',
        user: userWithoutPassword,
        token,
      },
      {
        status: 200,
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
    console.error('Login error:', error);
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
