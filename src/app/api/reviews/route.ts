// app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    body.classId = String(body.classId); // Ensure classId is a string
    console.log('Received data:', body);  // Log the received data
    const review = await Review.create(body);
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);  // Log the full error
    return NextResponse.json({ error: 'Error creating review', details: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');

  if (!classId) {
    return NextResponse.json({ error: 'ClassId is required' }, { status: 400 });
  }

  try {
    const reviews = await Review.find({ classId: String(classId) }).sort({ createdAt: -1 });
    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Error fetching reviews', details: error.message }, { status: 500 });
  }
}