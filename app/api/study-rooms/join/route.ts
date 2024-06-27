
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserData } from '@/app/actions';
export async function POST(req: NextRequest) {
    const { user, username } = await getUserData();
    try {
      if (!user || !username) {
        return NextResponse.json({ message: "Authentication required" }, { status: 401 });
      }
        const {code}  = await req.json();
        const room = await prisma.studyRoom.findUnique({
            where:{
                code:code
            }
        });
        if(!room){
            return NextResponse.json({message:"Room not found"},{status:404});
        }
        try{
            await prisma.studyRoomMember.create({
                data:{
                    username:username,
                    studyRoom_id:room.id
                }
            });
            return NextResponse.json({message:"Room joined successfully"},{status:200});
        }
        catch(error){
            console.error("Error joining room:", error);
            return NextResponse.json({ message: "Check if you have already joined" }, { status: 500 });
        }

    }
    catch(error){
        console.error("Error joining room:", error);
        return NextResponse.json({ message: "Error joining room" }, { status: 500 });
    }
}