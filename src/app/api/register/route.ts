import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  await dbConnect();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    return NextResponse.json({ message: 'User registered successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'User registration failed', error });
  }
}