import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(req:NextApiRequest,context:any){
    const {roomId,day} = context.params;

    //enable authotrization\
    const time = new Date()
    time.setHours(0,0,0,0)
    const tomorrow = new Date()
    tomorrow.setHours(0,0,0,0)
    tomorrow.setDate(time.getDate() + 1)

    const tasks = await prisma.studyRoomDay.findUnique({
        where:{
            room_id_day:{
                room_id:roomId,
                day:parseInt(day)
            }
        },
        include:{
            StudyRoomContent:true,
        }
    });
    let isLive = false , isDead = false;
    if (tasks?.scheduled_date)
{     isLive = tasks?.scheduled_date >= time && tasks?.scheduled_date < tomorrow;
     isDead = tasks?.scheduled_date > tomorrow;
}    return NextResponse.json({tasks : tasks?.StudyRoomContent || [] , dayInfo:{isLive,isDead}}  ,{status:200});
}


