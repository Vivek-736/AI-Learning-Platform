import { db } from "@/config/db";
import { quizzesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const quizzes = await db.select().from(quizzesTable)
            .where(eq(quizzesTable.userEmail, user.primaryEmailAddress.emailAddress))
            .orderBy(desc(quizzesTable.createdAt));

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
    }
}