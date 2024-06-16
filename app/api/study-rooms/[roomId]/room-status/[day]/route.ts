import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
export async function GET(req:NextApiRequest,context:any){
    const {room_id,day} = context.params

    //enable authotrization\
    const time = new Date()
    time.setHours(0,0,0,0);
    const today = time.toISOString();


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

    
}