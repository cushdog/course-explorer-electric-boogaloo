import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the token cookie (or session) here as needed
  return NextResponse.json({ message: 'Logged out successfully' });
}