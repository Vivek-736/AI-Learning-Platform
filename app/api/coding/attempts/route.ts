import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { codingAttemptsTable, codingChallengesTable } from "@/config/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get('userEmail');
        const attemptId = searchParams.get('attemptId');

        // If attemptId is provided, fetch specific attempt
        if (attemptId) {
            const attempt = await db.select()
                .from(codingAttemptsTable)
                .where(eq(codingAttemptsTable.attemptId, attemptId))
                .limit(1);

            if (!attempt || attempt.length === 0) {
                return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
            }

            const challenge = await db.select()
                .from(codingChallengesTable)
                .where(eq(codingChallengesTable.challengeId, attempt[0].challengeId as string))
                .limit(1);

            return NextResponse.json({
                attempt: attempt[0],
                challenge: challenge[0] || null
            });
        }

        // For fetching all attempts, userEmail is required
        if (!userEmail) {
            return NextResponse.json(
                { error: "User email is required" },
                { status: 400 }
            );
        }

        const attempts = await db.select()
            .from(codingAttemptsTable)
            .where(eq(codingAttemptsTable.userEmail, userEmail))
            .orderBy(desc(codingAttemptsTable.createdAt));

        const attemptsWithChallenges = await Promise.all(
            attempts.map(async (attempt) => {
                const challenge = await db.select()
                    .from(codingChallengesTable)
                    .where(eq(codingChallengesTable.challengeId, attempt.challengeId as string))
                    .limit(1);

                return {
                    ...attempt,
                    challengeTitle: challenge[0]?.title || "Unknown Challenge",
                    challengeDifficulty: challenge[0]?.difficulty || "medium",
                    challengeTopic: challenge[0]?.topic || "Full Syllabus",
                    testType: challenge[0]?.testType || "full-syllabus"
                };
            })
        );

        return NextResponse.json({
            attempts: attemptsWithChallenges,
            totalAttempts: attemptsWithChallenges.length
        });

    } catch (error) {
        console.error("Error fetching attempts:", error);
        return NextResponse.json(
            { error: "Failed to fetch attempts" },
            { status: 500 }
        );
    }
}