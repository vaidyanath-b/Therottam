

import { NextRequest ,NextResponse } from "next/server";
import {prisma } from "@/lib/prisma";
import { getUserData } from "@/app/actions";
export async function POST(req:NextRequest,context:any){

    const {roomId,day,taskId} = context.params;
    const {username} = await getUserData();
    if(!username){
        return NextResponse.json("User not found" , {status:404 , statusText:"User not found"});
    }
    const task = await prisma.contentMark.findUnique({
        where:{
            studyRoom_id_day_content_id_username:{
                studyRoom_id:roomId,
                day:parseInt(day),
                content_id:parseInt(taskId),
                username:String(username)
            }
        }
    });
    
   if(!task){
          await prisma.contentMark.create({
                data:{
                    studyRoom_id:roomId,
                    day:parseInt(day),
                    content_id:parseInt(taskId),
                    username:String(username)
                }
            });

            return NextResponse.json("Task marked as done" , {status:200 , statusText:"Task marked as done"});
   }    

}
