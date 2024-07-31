import { NextRequest, NextResponse } from 'next/server';
import { deleteObject } from '@/lib/aws';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    await deleteObject(key);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
  }
}