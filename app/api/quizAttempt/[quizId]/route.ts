

import { NextRequest , NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserData } from "@/app/actions";



export async function GET(req: NextRequest , context:any) {
try{
    const {quizId} = context.params;
    if (!quizId) {
        console.log("No quizId provided");
        return NextResponse.json({message:"no quizId provided" },{ status:404})
    }
    console.log(quizId);
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId
        }, 
        include: {
            questions: {
                include: {
                    question:{
                        include: {
                            QuestionTopic: {
                                include:{
                                    topic: true
                                }
                            }
                        }
                    }
                }
            },
            topics: {
                include:{
                    topic: true
                
                }
            }
        }
    });

    if (!quiz) {
        return NextResponse.json({message:"no quiz exists" },{ status:404})
    }
    
    const quizSend = {
        id: quiz.id,
        questions: quiz.questions.map((question,index) => {
            return {
                index : question.index,
                id: question.questionId,
                question: question.question.question,
                options: question.question.options.map((option) => {
                    return {
                        text : option,
                    }

                    }),
                type: question.question.type,
                tags: question.question.QuestionTopic.map((questionTopic) => {
                    return questionTopic.topic;
                })
            }
        }),
        topics: quiz.topics.map((topic) => {
            topic.topic
        })
    }
    console.log(quizSend);
    return NextResponse.json({quiz:quizSend },{status:200});
}
catch (error) {
    console.error("Error getting quiz:", error);
    return NextResponse.json({message:"error sending quiz" },{ status:404})
}
    
}

export async function POST(req: NextRequest , context:any) {
try{
    const {quizId} = context.params;
    const {username} = await getUserData();
    const {roomId , day, attempts} = await req.json();
    const quizQuestions = await prisma.quizQuestion.findMany({
        where:{
            quizId:quizId
        },
        include:{
            question:true
        }
    });
    const questions = quizQuestions.reduce((acc:any, question:any) => {
        acc[question.question.id] = question.question;
        return acc;
    }, {});    
    
    const quiz = await prisma.quizAttempt.create({
        data:{
            quizId:quizId,
            username:String(username),
            studyRoom_id:roomId,
            day:parseInt(day),
        },
    });
    console.log(quiz);

    let score =0;
    console.log("attempts" , attempts)
    for(const attemptKey in attempts){
        const attempt:string[] = attempts[attemptKey];
        const isCorrect = attempt.length === questions[attemptKey].correctOption.length &&
                  attempt.every((answer:any) => questions[attemptKey].correctOption.includes(answer)) &&
                  questions[attemptKey].correctOption.every((option:any) => attempt.includes(option));
        if(isCorrect){
            score++;
        }
        await prisma.questionAttempt.create({
            data:{
                attemptId:quiz.attemptId,
                username:String(username),
                quizId:quizId,
                questionId: attemptKey,
                studyRoom_id:roomId,
                answer: attempt,
                correct: isCorrect,
                day:parseInt(day),
            }
        })
    }
   const res =  await prisma.quizAttempt.update({
        where:{
            studyRoom_id_quizId_username_day_attemptId:
{            
        quizId:quizId,
            username:String(username),
            studyRoom_id:roomId,
            day:parseInt(day),
            attemptId:quiz.attemptId
}      },
        data:{
            score: score
        },
        include:{
            QuestionAttempt:{
                include:{
                    question:true
                }
            }
        }
    })
    console.log(JSON.stringify(res));
    const result = {...res , QuestionAttempt :res.QuestionAttempt.map((questionAttempt) => {
        return {
            ...questionAttempt,
            question: questions[questionAttempt.questionId],
        }

    }
    )}
    return NextResponse.json(result,{status:200});
}
    catch (error) {
        console.error("Error submitting quiz:", error);
        return NextResponse.json({message:"error submitting quiz" },{ status:404})
    }
}