import { db } from "@/config/db";
import { quizAttemptsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, sql, count } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const stats = await db.select({
            totalAttempts: count(),
            averageScore: sql<number>`AVG(${quizAttemptsTable.percentage})`,
            bestScore: sql<number>`MAX(${quizAttemptsTable.percentage})`,
            totalTimeSpent: sql<number>`SUM(${quizAttemptsTable.timeSpent})`,
            quizzesTaken: sql<number>`COUNT(DISTINCT ${quizAttemptsTable.quizId})`
        })
        .from(quizAttemptsTable)
        .where(eq(quizAttemptsTable.userEmail, user.primaryEmailAddress.emailAddress));

        const result = stats[0] || {
            totalAttempts: 0,
            averageScore: 0,
            bestScore: 0,
            totalTimeSpent: 0,
            quizzesTaken: 0
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching quiz stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}