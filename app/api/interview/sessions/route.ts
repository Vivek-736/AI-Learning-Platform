import { db } from "@/config/db";
import { interviewSessionsTable, interviewLinksTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { linkId, candidateName, candidateEmail, candidatePhone } = await request.json();

        const link = await db.select().from(interviewLinksTable)
            .where(eq(interviewLinksTable.linkId, linkId))
            .limit(1);

        if (link.length === 0 || !link[0].isActive) {
            return NextResponse.json({ error: 'Invalid interview link' }, { status: 404 });
        }

        const sessionId = uuidv4();
        await db.insert(interviewSessionsTable).values({
            sessionId,
            linkId,
            templateId: link[0].templateId,
            candidateName,
            candidateEmail,
            candidatePhone,
            status: 'pending'
        });

        return NextResponse.json({ sessionId, message: 'Interview session created successfully' });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create session' + error }, { status: 500 });
    }
}