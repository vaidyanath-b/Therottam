import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuestionType } from '@prisma/client'
export const PUT = async (req: NextRequest, context:any) => {
    try {
        const  data  = await req.json();
        const {questionId} = context.params;
        const question = data.question
        console.log("question to update",question);
        if (!question) {
            console.log("No question provided");
            return NextResponse.json({ message: "no question provided" }, { status: 404 });
        }
        const updatedQuestion = await prisma.question.update({
            where: {
                id: questionId
            },
            data: {
                question: question.question,
                correctOption: question.correctOption,
                options: question.options,
                type: question.type === "MULTIPLE_CHOICE" ? QuestionType.MULTIPLE_CHOICE : QuestionType.TRUE_FALSE,
            },
        });

        console.log("Question updated", updatedQuestion.id);
            // Delete old tags
// Find old tag IDs
const oldTags = await prisma.questionTopic.findMany({
    where: {
        questionId: updatedQuestion.id
    },
    select: {
        topicId: true
    }
});
const oldTagIds = oldTags.map(tag => tag.topicId);

// Find new tag IDs
const newTagIds = question.tags;

// Find tag IDs that don't already exist
const tagIdsToCreate = newTagIds.filter((tagId:string) => !oldTagIds.includes(tagId));

const tagIdsToDelete = oldTagIds.filter((tagId:string) => !newTagIds.includes(tagId));
// Create new tags
const questionTopics = tagIdsToCreate.map((tagId: any) => prisma.questionTopic.create({
    data: {
        questionId: updatedQuestion.id,
        topicId: tagId
    }
}));

const questionTopicsToDelete = tagIdsToDelete.map((tagId: any) => prisma.questionTopic.deleteMany({ 
    where: {
        questionId: updatedQuestion.id,
        topicId: tagId
    }
}));
const transactionList = questionTopics.concat(questionTopicsToDelete);
if (transactionList.length > 0) 
    await prisma.$transaction(questionTopics);        
        return NextResponse.json({ message: "Question updated" }, { status: 200 });
    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json({ message: "Error updating question" }, { status: 500 });
    }
}