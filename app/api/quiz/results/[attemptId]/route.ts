import { db } from "@/config/db";
import { quizAttemptsTable, quizzesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { attemptId } = await params;

        const result = await db.select({
            attemptId: quizAttemptsTable.attemptId,
            quizTitle: quizzesTable.title,
            score: quizAttemptsTable.score,
            totalQuestions: quizAttemptsTable.totalQuestions,
            percentage: quizAttemptsTable.percentage,
            timeSpent: quizAttemptsTable.timeSpent,
            completedAt: quizAttemptsTable.completedAt,
            questions: quizzesTable.questions,
            userAnswers: quizAttemptsTable.answers
        })
        .from(quizAttemptsTable)
        .innerJoin(quizzesTable, eq(quizAttemptsTable.quizId, quizzesTable.qid))
        .where(and(
            eq(quizAttemptsTable.attemptId, attemptId),
            eq(quizAttemptsTable.userEmail, user.primaryEmailAddress.emailAddress)
        ))
        .limit(1);

        if (result.length === 0) {
            return NextResponse.json({ error: 'Results not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
    }
}