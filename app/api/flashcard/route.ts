import { db } from "@/config/db";
import { flashcardSetsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const flashcardSets = await db.select().from(flashcardSetsTable)
            .where(eq(flashcardSetsTable.userEmail, user.primaryEmailAddress.emailAddress))
            .orderBy(desc(flashcardSetsTable.createdAt));

        return NextResponse.json(flashcardSets);
    } catch (error) {
        console.error('Error fetching flashcard sets:', error);
        return NextResponse.json({ error: 'Failed to fetch flashcard sets' }, { status: 500 });
    }
}