import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const findUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    console.log("API route hit");
    console.log("Params:", params);
    
    await dbConnect();
    
    try {
      const { id } = params;
      console.log("User ID:", id);
  
      if (!id) {
        console.log("No ID provided");
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }
  
      const user = await findUserByEmail(id);
      console.log("User found:", user ? "Yes" : "No");
  
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ favoritedClasses: user.favoritedClasses }, { status: 200 });
    } catch (error: any) {
      console.error("Error in API route:", error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }