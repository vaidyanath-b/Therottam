import { NextRequest} from "next/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserData } from "@/app/actions";
export async function GET(req:NextRequest,context:any){
    const {roomId,day} = context.params;
    const {username} = await getUserData();
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
            StudyRoomContent:{
                include:{
                    ContentMark:{
                        where:{
                            username: username
                        }
                    }
                }
            }
        }
    });
    let isLive = false , isDead = false;
    if (tasks?.scheduled_date)
{     isLive = tasks?.scheduled_date >= time && tasks?.scheduled_date < tomorrow;
     isDead = tasks?.scheduled_date > tomorrow;
}    return NextResponse.json({tasks : tasks?.StudyRoomContent || [] , dayInfo:{isLive,isDead}}  ,{status:200});
}


export async function POST(req:NextRequest,context:any){
    const {roomId,day} = context.params;
    const content= await req.json();
    console.log("content is ", content);
    const tasks = await prisma.studyRoomContent.create({
        data:{
            studyRoom_id:roomId,
            day:parseInt(day),
            title:content.title,
            link:content.link,
            resource:content.resource,
            difficulty:content.difficulty,
            creator_id:content.creator_id,
        }
    });
    console.log("tasks are ", tasks);

    return NextResponse.json({tasks : tasks} ,{status:200});
}
