
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function DELETE (req: NextRequest, context: any) {
    try {
        const { questionId , quizId } = context.params;
        if (!questionId || !questionId) {
            console.log("No questionId or quizId provided");
            return NextResponse.json({ message: "no questionId or quizId provided" }, { status: 404 });
        }

       const res =  await prisma.quizQuestion.deleteMany({
            where: {
                questionId: questionId,
                quizId: quizId
            }
        });

        return NextResponse.json({ message: "Question deleted" }, { status: 200 });
    } catch (error) {

        console.error("Error deleting question:", error);
        return NextResponse.json({ message: "Error deleting question" }, { status: 404 });
    }
}
