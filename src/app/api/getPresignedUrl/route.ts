import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUrl } from '@/lib/aws';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  try {
    const url = await generatePresignedUrl(key);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Error generating presigned URL' }, { status: 500 });
  }
}