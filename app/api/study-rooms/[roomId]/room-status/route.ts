import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createDay } from "@/utils/day.services";

export  async function GET (req: NextRequest , context :any) {
    const {roomId} = context.params;
    const time = new Date()
    time.setHours(0,0,0,0);
    const today = time.toISOString();

    const days = await prisma.studyRoomDay.findMany({
      where: {
        room_id: roomId,
        scheduled_date: {
          gte: today
        }
      },
      select: {
        day:true
      },
      distinct: ['day'],
    //   orderBy:{
    //     day:'asc'
    //   }
    });
    
    const uniqueDayNumbers = days.map(day => day.day);    
    let minDay;
    if (uniqueDayNumbers.length > 1) {
      minDay = Math.min(...uniqueDayNumbers);
      return NextResponse.json({day: minDay});
    } else if (uniqueDayNumbers.length) {
      minDay = uniqueDayNumbers[0];
      await createDay({roomId: roomId , day: minDay+1}); //change needed
      return NextResponse.json({day: minDay});
    }
    else {
        const {_max} = await prisma.studyRoomContent.aggregate({
            _max :{
                day : true
            },
            where:{
                studyRoom_id : roomId
            }
        }
    );
    if (_max.day === null){
        // await createDay(roomId , 1);
        // await createDay(roomId,2)
        await createDay({roomId :roomId ,day: 1,today:true});
        return NextResponse.json({day:1 } ,{status:200 , statusText:"Day 1 created"})
    }
    else{
      await createDay({roomId :roomId ,day: _max.day+1,today:true});
        return NextResponse.json({day:_max.day})
    }
    }
      //change needed
    }
