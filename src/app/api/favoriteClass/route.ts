import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const findUserByEmail = async (email: string) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

export async function POST(req: NextRequest) {
    await dbConnect();

    
    try {
        const { userId, classId } = await req.json();
        console.log(userId);
        const user = await findUserByEmail(userId);
        
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        if (!user.favoritedClasses.includes(classId)) {
            user.favoritedClasses.push(classId);
            await user.save();
        }

        return NextResponse.json({ message: 'Class favorited', favoritedClasses: user.favoritedClasses }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    await dbConnect();
    try {
        const { userId, classId } = await req.json();
        const user = await findUserByEmail(userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        user.favoritedClasses = user.favoritedClasses.filter((id) => id !== classId);
        await user.save();

        return NextResponse.json({ message: 'Class unfavorited', favoritedClasses: user.favoritedClasses }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}