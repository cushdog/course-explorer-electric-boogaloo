import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/protected-route', '/api/another-protected-route'],
};