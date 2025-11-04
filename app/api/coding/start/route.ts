import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { codingAttemptsTable, codingChallengesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { challengeId, userEmail } = await req.json();

        if (!challengeId || !userEmail) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const challenge = await db.select()
            .from(codingChallengesTable)
            .where(eq(codingChallengesTable.challengeId, challengeId))
            .limit(1);

        if (!challenge || challenge.length === 0) {
            return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
        }

        const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const attempt = await db.insert(codingAttemptsTable).values({
            attemptId,
            challengeId,
            userEmail,
            status: 'in-progress',
            solutions: [],
            totalScore: 0,
            problemsAttempted: 0,
            problemsSolved: 0,
            testCasesPassed: 0,
            testCasesFailed: 0
        }).returning();

        return NextResponse.json({
            success: true,
            attemptId: attempt[0].attemptId
        });
    } catch (error) {
        console.error("Error starting attempt:", error);
        return NextResponse.json(
            { error: "Failed to start attempt" },
            { status: 500 }
        );
    }
}