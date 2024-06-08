
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function DELETE (req: NextRequest, context: any) {
    try {
        const { questionId , quizId } = context.params;
        if (!questionId || !questionId) {
            console.log("No questionId or quizId provided");
            return NextResponse.json({ message: "no questionId or quizId provided" }, { status: 404 });
        }
        const question = await prisma.quizQuestion.findUnique({
            where: {
                quizId_questionId: {
                    questionId: questionId,
                    quizId: quizId
                }
            }
        });

        if (!question) {
            return NextResponse.json({ message: "no question exists" }, { status: 404 });
        }
        if (question.index)
{        await prisma.quizQuestion.updateMany({
            where: {
                quizId: quizId,
                index: {
                    gt: question.index
                }
            },
            data: {
                index: {
                    decrement: 1
                }
            }
        });
}       
const res =  await prisma.quizQuestion.deleteMany({
            where: {
                questionId: questionId,
                quizId: quizId
            },
        });

        return NextResponse.json({ message: "Question deleted" }, { status: 200 });
    } catch (error) {

        console.error("Error deleting question:", error);
        return NextResponse.json({ message: "Error deleting question" }, { status: 404 });
    }
}
