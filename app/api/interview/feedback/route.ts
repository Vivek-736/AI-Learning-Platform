import { db } from "@/config/db";
import { interviewSessionsTable, interviewTemplatesTable, interviewLinksTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const attempts = await db.select({
            sessionId: interviewSessionsTable.sessionId,
            candidateName: interviewSessionsTable.candidateName,
            candidateEmail: interviewSessionsTable.candidateEmail,
            templateTitle: interviewTemplatesTable.title,
            overallScore: interviewSessionsTable.overallScore,
            duration: interviewSessionsTable.duration,
            completedAt: interviewSessionsTable.completedAt,
            status: interviewSessionsTable.status
        })
        .from(interviewSessionsTable)
        .innerJoin(interviewLinksTable, eq(interviewSessionsTable.linkId, interviewLinksTable.linkId))
        .innerJoin(interviewTemplatesTable, eq(interviewSessionsTable.templateId, interviewTemplatesTable.templateId))
        .where(eq(interviewLinksTable.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(interviewSessionsTable.completedAt));

        return NextResponse.json(attempts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch feedback' + error }, { status: 500 });
    }
}