import { db } from "@/config/db";
import { interviewSessionsTable, interviewLinksTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET() {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const sessions = await db.select({
            sessionId: interviewSessionsTable.sessionId,
            candidateName: interviewSessionsTable.candidateName,
            overallScore: interviewSessionsTable.overallScore,
            skillScores: interviewSessionsTable.skillScores,
            detailedFeedback: interviewSessionsTable.detailedFeedback,
            status: interviewSessionsTable.status,
        })
        .from(interviewSessionsTable)
        .innerJoin(interviewLinksTable, eq(interviewSessionsTable.linkId, interviewLinksTable.linkId))
        .where(eq(interviewLinksTable.createdBy, user.primaryEmailAddress.emailAddress));

        const totalAttempts = sessions.length;
        const completedAttempts = sessions.filter(s => s.status === 'completed').length;
        
        const completedSessions = sessions.filter(s => s.status === 'completed' && s.overallScore);
        const averageScore = completedSessions.length > 0 
            ? completedSessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / completedSessions.length 
            : 0;

        const topPerformer = completedSessions.reduce((best, current) => {
            if (!best || (current.overallScore || 0) > (best.overallScore || 0)) {
                return current;
            }
            return best;
        }, null as any);

        const allStrengths: string[] = [];
        const allWeaknesses: string[] = [];

        completedSessions.forEach(session => {
            if (session.detailedFeedback) {
                const feedback = session.detailedFeedback as any;
                if (feedback.strengths) {
                    allStrengths.push(...feedback.strengths);
                }
                if (feedback.improvements) {
                    allWeaknesses.push(...feedback.improvements);
                }
            }
        });

        const strengthCounts = allStrengths.reduce((acc, strength) => {
            acc[strength] = (acc[strength] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const weaknessCounts = allWeaknesses.reduce((acc, weakness) => {
            acc[weakness] = (acc[weakness] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const commonStrengths = Object.entries(strengthCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([strength]) => strength);

        const commonWeaknesses = Object.entries(weaknessCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([weakness]) => weakness);

        const stats = {
            totalAttempts,
            completedAttempts,
            averageScore: Math.round(averageScore),
            topPerformer: topPerformer ? {
                name: topPerformer.candidateName,
                score: topPerformer.overallScore
            } : null,
            commonStrengths,
            commonWeaknesses
        };

        return NextResponse.json(stats);

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}