import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { QuestionType } from '@prisma/client';


export const POST = async (req: NextRequest) => {
    try {
        const  data  = await req.json();
        const question = data.question
        console.log(question);
        if (!question) {
            console.log("No question provided");
            return NextResponse.json({ message: "no question provided" }, { status: 404 });
        }
        const newQuestion = await prisma.question.create({
            data: {
                question: question.question,
                correctOption: question.correctOption,
                options: question.options,
                type: question.type === "MULTIPLE_CHOICE" ? QuestionType.MULTIPLE_CHOICE : QuestionType.TRUE_FALSE,
            },
        });

        console.log("Question created", newQuestion.id);
        if (question.quizId) {
            const quizQuestion = await prisma.quizQuestion.create({
                data: {
                    index : question.index,
                    quizId: question.quizId,
                    questionId: newQuestion.id
                }
            });
            console.log("Quiz Question created", quizQuestion.quizId, quizQuestion.questionId);
        }

        if (question.tags) {
            const questionTopics = question.tags.map((tag: any) => prisma.questionTopic.create({
                data: {
                    questionId: newQuestion.id,
                    topicId: tag
                }
            }));

            await prisma.$transaction(questionTopics);
        }
        return NextResponse.json({ message: "Question created" }, { status: 200 });
    } catch (error) {
        console.error("Error creating question:", error);
        return NextResponse.json({ message: "Error creating question" }, { status: 500 });
    }
}