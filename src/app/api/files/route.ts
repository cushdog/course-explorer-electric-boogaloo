import { NextRequest, NextResponse } from 'next/server';
import { listObjects } from '@/lib/aws';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const classParam = searchParams.get('classParam');

  if (!classParam) {
    return NextResponse.json({ error: 'Invalid classParam' }, { status: 400 });
  }

  try {
    const files = await listObjects(`${classParam}/`);
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Error fetching files' }, { status: 500 });
  }
}