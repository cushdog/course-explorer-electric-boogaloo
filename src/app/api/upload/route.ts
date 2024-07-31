import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from '@/lib/aws';

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

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    // Construct the URL manually since PutObjectCommand doesn't return a Location
    const url = `https://${params.Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${params.Key}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}