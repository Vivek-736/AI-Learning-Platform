import { db } from "@/config/db";
import { interviewLinksTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const links = await db.select().from(interviewLinksTable)
            .where(eq(interviewLinksTable.createdBy, user.primaryEmailAddress.emailAddress))
            .orderBy(desc(interviewLinksTable.createdAt));

        return NextResponse.json(links);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { templateId, title, instructions } = await request.json();

        const linkId = uuidv4();
        await db.insert(interviewLinksTable).values({
            linkId,
            templateId,
            createdBy: user.primaryEmailAddress.emailAddress,
            title,
            instructions: instructions || 'Please complete this interview honestly and speak clearly.',
            isActive: true,
            allowAnonymous: true
        });

        return NextResponse.json({ 
            linkId, 
            shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/interview/${linkId}`,
            message: 'Interview link created successfully' 
        });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
    }
}