import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req:NextRequest,context:any){
    const {roomId,day} = context.params

    //enable authotrization\
    const time = new Date()
    time.setHours(0,0,0,0)
    const tomorrow = new Date()
    tomorrow.setHours(0,0,0,0)
    tomorrow.setDate(time.getDate() + 1)

    const roomDay = await prisma.studyRoomDay.findUnique({
        where:{
            room_id_day:{
                room_id:roomId,
                day:parseInt(day)
            }
            
        },
        include:{
            studyRoom:true,
            StudyRoomQuiz:true
        }
    });
    const quizzesWithQuestionCount = await Promise.all(roomDay?.StudyRoomQuiz.map(async (quiz) => {
        const quizQuestionCount = await prisma.quizQuestion.count({
            where: {
                quizId: quiz.quizId
            }
        });
        return {
            ...quiz,
            questionCount: quizQuestionCount
        };
    }) || []);
    const resRoomDay = {
        ...roomDay,
        StudyRoomQuiz: quizzesWithQuestionCount
    };
    if (!roomDay)
        {return NextResponse.json({},{status:400 , statusText:"no room day got"})}
    const scheduled_date = new Date(roomDay.scheduled_date)
    
    let isLive = scheduled_date >= time && scheduled_date < tomorrow;
    let isDead = (scheduled_date < time) && !isLive;
    

    return NextResponse.json({...resRoomDay, isLive: isLive , isDead:isDead},{status : 200});

    
}