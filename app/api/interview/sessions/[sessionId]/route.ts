import { db } from "@/config/db";
import { interviewSessionsTable, interviewTemplatesTable, coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
    try {
        const { sessionId } = await params;
        
        const result = await db.select({
            sessionId: interviewSessionsTable.sessionId,
            candidateName: interviewSessionsTable.candidateName,
            candidateEmail: interviewSessionsTable.candidateEmail,
            status: interviewSessionsTable.status,
            templateTitle: interviewTemplatesTable.title,
            courseName: coursesTable.name,
            difficulty: interviewTemplatesTable.difficulty,
            estimatedDuration: interviewTemplatesTable.estimatedDuration,
            questions: interviewTemplatesTable.questions,
            skillsToAssess: interviewTemplatesTable.skillsToAssess
        })
        .from(interviewSessionsTable)
        .innerJoin(interviewTemplatesTable, eq(interviewSessionsTable.templateId, interviewTemplatesTable.templateId))
        .innerJoin(coursesTable, eq(interviewTemplatesTable.courseId, coursesTable.cid))
        .where(eq(interviewSessionsTable.sessionId, sessionId))
        .limit(1);

        if (result.length === 0) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
    try {
        const { sessionId } = await params;
        const updates = await request.json();

        const updateData = {
            ...updates,
            updatedAt: new Date(),
            ...(updates.startedAt && {
                startedAt: new Date(updates.startedAt)
            }),
            ...(updates.completedAt && {
                completedAt: new Date(updates.completedAt)
            }),
            ...(updates.conversationTranscript && {
                conversationTranscript: JSON.stringify(updates.conversationTranscript)
            })
        };

        if (updates.startedAt && !(updateData.startedAt instanceof Date) || (updateData.startedAt && isNaN(updateData.startedAt.getTime()))) {
            throw new Error(`Invalid startedAt date: ${updates.startedAt}`);
        }
        if (updates.completedAt && !(updateData.completedAt instanceof Date) || (updateData.completedAt && isNaN(updateData.completedAt.getTime()))) {
            throw new Error(`Invalid completedAt date: ${updates.completedAt}`);
        }

        await db.update(interviewSessionsTable)
            .set(updateData)
            .where(eq(interviewSessionsTable.sessionId, sessionId));

        return NextResponse.json({ message: 'Session updated successfully' });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error updating session:', error);
        return NextResponse.json({ error: `Failed to update session: ${error.message}`, status: 500 });
    }
}