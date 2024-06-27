import { NextRequest,NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest ,context:any) {
   
    const {roomId} =  context.params;
    try{
        const leaderboard = await prisma.studyRoomMember.findMany({
            where:{
                studyRoom_id:roomId
            },
            select:{
                username:true,
                contents_completed:true,
                quizes_won:true,
                quizScore:true,
                contentCreated:true,
                quizesCreated:true
            },
            orderBy:{
                contents_completed:'desc'
            }
        });

        return NextResponse.json(leaderboard,{status:200});
    }
    catch(err){
        return NextResponse.json({message:"Error fetching leaderboard"},{status:500});
    }
}
