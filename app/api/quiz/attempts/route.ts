import { db } from "@/config/db";
import { quizAttemptsTable, quizzesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const recent = searchParams.get('recent');

        let query = db.select({
            attemptId: quizAttemptsTable.attemptId,
            quizId: quizAttemptsTable.quizId,
            quizTitle: quizzesTable.title,
            score: quizAttemptsTable.score,
            totalQuestions: quizAttemptsTable.totalQuestions,
            percentage: quizAttemptsTable.percentage,
            timeSpent: quizAttemptsTable.timeSpent,
            completedAt: quizAttemptsTable.completedAt,
            difficulty: quizzesTable.difficulty
        })
        .from(quizAttemptsTable)
        .innerJoin(quizzesTable, eq(quizAttemptsTable.quizId, quizzesTable.qid))
        .where(eq(quizAttemptsTable.userEmail, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(quizAttemptsTable.completedAt));

        if (recent === 'true') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            query = query.limit(5);
        }

        const attempts = await query;
        return NextResponse.json(attempts);

    } catch (error) {
        console.error('Error fetching quiz attempts:', error);
        return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
    }
}