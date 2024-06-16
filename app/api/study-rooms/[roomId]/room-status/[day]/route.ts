import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(req:NextApiRequest,context:any){
    const {room_id,day} = context.params

    //enable authotrization\
    const time = new Date()
    time.setHours(0,0,0,0)
    const tomorrow = new Date()
    tomorrow.setHours(0,0,0,0)
    tomorrow.setDate(time.getDate() + 1)

    const roomDay = await prisma.studyRoomDay.findUnique({
        where:{
            room_id_day:{
                room_id:room_id,
                day:day
            }
            
        },
        include:{
            studyRoom:true,
            StudyRoomQuiz:true,
            StudyRoomContent:true


        }
    });
    if (!roomDay)
        return NextResponse.json({},{status:400 , statusText:"no room day got"})
    const scheduled_date = new Date(roomDay.scheduled_date)



    
    NextResponse.json({...roomDay, isLive: scheduled_date > time && scheduled_date < tomorrow , isDead: scheduled_date > tomorrow},{status : 200});

    
}