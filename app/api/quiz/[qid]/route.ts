import { db } from "@/config/db";
import { quizzesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { qid: string } }) {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const quiz = await db.select().from(quizzesTable)
            .where(and(
                eq(quizzesTable.qid, params.qid),
                eq(quizzesTable.userEmail, user.primaryEmailAddress.emailAddress)
            ))
            .limit(1);

        if (quiz.length === 0) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        return NextResponse.json(quiz[0]);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
    }
}