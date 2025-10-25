import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET_SET: !!process.env.JWT_SECRET,
        MONGODB_URI_SET: !!process.env.MONGODB_URI,
        MONGODB_DB: process.env.MONGODB_DB,
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}