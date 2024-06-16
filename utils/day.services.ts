import { prisma } from "@/lib/prisma";

interface CreateDayParams {
    roomId : string;
    day : number;
}
export async function createDay(params:CreateDayParams){
    const time = new Date()
    time.setHours(0,0,0,0);
    time.setDate(time.getDate() + 1);
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
    const latestQuizCreators = await prisma.studyRoomQuiz.findMany({
        select:{
            creator_id:true,
            studyRoom:true
        },
        where:{
            studyRoom_id: roomId,
            day : {
                in : last3days
            }
        

        },
        
    });
    const latestContentCreators = await prisma.studyRoomContent.findMany({
        select:{
            creator_id:true
        },
        where:{
            studyRoom_id: roomId,
            day : {
                in : last3days
            }

        }
    });
    const latestCreators = [...latestQuizCreators, ...latestContentCreators];

    const uniqueCreators:string[] = Array.from(new Set(latestCreators.map(item => item?.creator_id || '')));

    let newQuizCreator = await prisma.studyRoomMember.findFirst({

        where :{
            studyRoom_id : roomId,
            username : {
                notIn : uniqueCreators
            }
        
        },
        orderBy : {
            quizesCreated : 'asc'
        }
    })
        if (!newQuizCreator){
            newQuizCreator = await prisma.studyRoomMember.findFirst({
                where :{
                    studyRoom_id : roomId,
                    username : {
                        not : uniqueCreators[-1]
                    }
                },
                orderBy : {
                    quizesCreated : 'asc'
                }
            })
        }
    uniqueCreators.push(newQuizCreator?.username || '');
    let newContentCreator = await prisma.studyRoomMember.findFirst({
        where :{
            studyRoom_id : roomId,
            username : {
                notIn : uniqueCreators
            }
        
        },
        orderBy : {
            contentCreated : 'asc'
        }
    })
    if (!newContentCreator){
        newContentCreator = await prisma.studyRoomMember.findFirst({
            where :{
                studyRoom_id : roomId,
                username : {
                    not : uniqueCreators[-1]
                }
            },
            orderBy : {
                contentCreated : 'asc'
            }
        })
    }

    await prisma.studyRoomContent.create({
        data:{
            studyRoom_id: roomId,
            creator_id: newContentCreator?.username || newDay.studyRoom.ownerId,
            day: day
        }
    });
    const {id} = await prisma.quiz.create({
        data:{
            owner_id : newQuizCreator?.username 
        }
    })
    await prisma.studyRoomQuiz.create({
        data:{
            studyRoom_id: roomId,
            creator_id: newQuizCreator?.username  || newDay.studyRoom.ownerId, 
            day: day,
            quizId : "sadad"
        },
        
    });
    console.log("creators,, ",newQuizCreator?.username, newContentCreator?.username)
    return newDay;
}
