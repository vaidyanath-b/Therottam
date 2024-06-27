import { prisma } from "@/lib/prisma";
import { difficulty_type } from "@prisma/client";

interface CreateDayParams {
    roomId : string;
    day : number;
    today?:boolean | undefined;
}
export async function createDay(params:CreateDayParams){

    const time = new Date()
    time.setHours(0,0,0,0);
    if(params.today === false)
{    
    time.setDate(time.getDate() + 1);
}    
    const scheduled_date = time.toISOString();
    const {roomId , day} = params;
    const newDay = await prisma.studyRoomDay.create({
        data:{
            room_id: roomId,
            day: day,
            scheduled_date : scheduled_date
        },
        select:{
            studyRoom:true
        }
    });
    let last3days:Int32List = [];
    if (day > 0){
      last3days = [day - 1 || 0, day - 2 || 0, day - 3 ||0]
    }
    // const latestQuizCreators = await prisma.studyRoomQuiz.findMany({
    //     select:{
    //         creator_id:true,
    //         studyRoom:true
    //     },
    //     where:{
    //         studyRoom_id: roomId,
    //         day : {
    //             in : last3days
    //         }
        

    //     },
        
    // });
    // const latestContentCreators = await prisma.studyRoomContent.findMany({
    //     select:{
    //         creator_id:true
    //     },
    //     where:{
    //         studyRoom_id: roomId,
    //         day : {
    //             in : last3days
    //         }

    //     }
    // });
    // const latestCreators = [...latestQuizCreators, ...latestContentCreators];

    // const uniqueCreators:string[] = Array.from(new Set(latestCreators.map(item => item?.creator_id || '')));
    const  optimalQuizCreatorIds = await prisma.studyRoomQuiz.findMany({
        distinct: ['creator_id'],
        orderBy: {
          day: 'desc',
        },
        select: {
          creator_id: true,
        },
      });
    const optimalContentCreatorIds = await prisma.studyRoomContent.findMany({
        distinct: ['creator_id'],
        orderBy: {
          day: 'desc',
        },
        select: {
          creator_id: true,
        },
      });
      const dic = {} as any;
    // let newQuizCreator = await prisma.studyRoomMember.findFirst({

    //     where :{
    //         studyRoom_id : roomId,
    //         username : {
    //             notIn : uniqueCreators
    //         }
        
    //     },
    //     orderBy : {
    //         quizesCreated : 'asc'
    //     }
    // })
    //     if (!newQuizCreator){
    //         newQuizCreator = await prisma.studyRoomMember.findFirst({
    //             where :{
    //                 studyRoom_id : roomId,
    //                 username : {
    //                     not : uniqueCreators[-1]
    //                 }
    //             },
    //             orderBy : {
    //                 quizesCreated : 'asc'
    //             }
    //         })
    //     }
    // uniqueCreators.push(newQuizCreator?.username || '');
    // let newContentCreator = await prisma.studyRoomMember.findMany({
    //     where :{
    //         studyRoom_id : roomId,
    //         username : {
    //             notIn : uniqueCreators
    //         }
        
    //     },
    //     orderBy : {
    //         contentCreated : 'asc'
    //     },
    //     take: 3
        
    // })
    // if (!newContentCreator){
    //     newContentCreator = await prisma.studyRoomMember.findFirst({
    //         where :{
    //             studyRoom_id : roomId,
    //             username : {
    //                 not : uniqueCreators[-1]
    //             }
    //         },
    //         orderBy : {
    //             contentCreated : 'asc'
    //         }
    //     })
    // }
    const studyRoomContentData = 
[{        studyRoom_id: roomId,
        creator_id: optimalContentCreatorIds[-1]?.creator_id || newDay.studyRoom.ownerId,
        day: day,
        difficulty: difficulty_type.HARD,},
{        studyRoom_id: roomId,
    creator_id: optimalContentCreatorIds[-2]?.creator_id || newDay.studyRoom.ownerId,
    day: day,
    difficulty: difficulty_type.MEDIUM,},
{
    studyRoom_id: roomId,
    creator_id: optimalContentCreatorIds[-3]?.creator_id || optimalContentCreatorIds[-2]?.creator_id || newDay.studyRoom.ownerId,
    day: day,
    difficulty: difficulty_type.EASY,
}
]
for(let i = 0; i < 3; i++)
    dic[optimalContentCreatorIds[-i]?.creator_id || newDay.studyRoom.ownerId] = (dic[optimalContentCreatorIds[-i]?.creator_id || newDay.studyRoom.ownerId] || 0) + 1;       

    await prisma.studyRoomContent.createMany({
        data:studyRoomContentData
    },
    

);
    const {id : quiz_id , owner_id} = await prisma.quiz.create({
        data:{
            owner_id : optimalQuizCreatorIds[-1]?.creator_id || newDay.studyRoom.ownerId, 
        }
    })

    await prisma.studyRoomQuiz.create({
        data:{
            studyRoom_id: roomId,
            creator_id: owner_id, 
            day: day,
            quizId : quiz_id
        },
        
    });

    await prisma.studyRoomMember.update({
        where:{
            username_studyRoom_id:{
            username: optimalQuizCreatorIds[-1]?.creator_id || newDay.studyRoom.ownerId,
            studyRoom_id: roomId
        }
        },
        data:{
            quizesCreated : {
                increment : 1
            }
        }
    });

    for(const key in dic){
        await prisma.studyRoomMember.update({
            where:{
                username_studyRoom_id:{
                username: key,
                studyRoom_id: roomId
            }
            },
            data:{
                contentCreated : {
                    increment : dic[key]
                }
            }
        });
    }

    console.log("creators ",optimalQuizCreatorIds[-1]?.creator_id, optimalContentCreatorIds.slice(-3)?.map(item => item.creator_id));
    return newDay;
}
