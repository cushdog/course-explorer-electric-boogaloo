import { NextRequest, NextResponse } from 'next/server';
import s3 from '@/lib/aws';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const classParam = formData.get('classParam') as string;

    if (!file || !classParam) {
      return NextResponse.json({ error: 'Missing file or classParam' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
      Key: `${classParam}/${file.name}`,
      Body: Buffer.from(buffer),
      ContentType: file.type || 'application/octet-stream',
    };

    const data = await s3.upload(params).promise();
    return NextResponse.json({ url: data.Location });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}