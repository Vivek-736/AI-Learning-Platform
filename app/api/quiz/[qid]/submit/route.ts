import { db } from "@/config/db";
import { quizAttemptsTable, quizzesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request, { params }: { params: { qid: string } }) {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { answers, timeSpent } = await request.json();

        const quiz = await db.select().from(quizzesTable)
            .where(and(
                eq(quizzesTable.qid, params.qid),
                eq(quizzesTable.userEmail, user.primaryEmailAddress.emailAddress)
            ))
            .limit(1);

        if (quiz.length === 0) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        const quizData = quiz[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const questions = quizData.questions as any[];

        let correctAnswers = 0;
        questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });

        const percentage = Math.round((correctAnswers / questions.length) * 100);
        const attemptId = uuidv4();

        await db.insert(quizAttemptsTable).values({
            attemptId,
            quizId: params.qid,
            userEmail: user.primaryEmailAddress.emailAddress,
            answers,
            score: correctAnswers,
            totalQuestions: questions.length,
            percentage,
            timeSpent: timeSpent || 0
        });

        return NextResponse.json({ 
            attemptId, 
            score: correctAnswers, 
            totalQuestions: questions.length, 
            percentage 
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
    }
}