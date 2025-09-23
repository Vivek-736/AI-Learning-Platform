import { db } from "@/config/db";
import { flashcardSetsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { fid: string } }) {
    try {
        const user = await currentUser();
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('Unauthorized', { status: 401 });
        }

        const flashcardSet = await db.select().from(flashcardSetsTable)
            .where(and(
                eq(flashcardSetsTable.fid, params.fid),
                eq(flashcardSetsTable.userEmail, user.primaryEmailAddress.emailAddress)
            ))
            .limit(1);

        if (flashcardSet.length === 0) {
            return NextResponse.json({ error: 'Flashcard set not found' }, { status: 404 });
        }

        return NextResponse.json(flashcardSet[0]);
    } catch (error) {
        console.error('Error fetching flashcard set:', error);
        return NextResponse.json({ error: 'Failed to fetch flashcard set' }, { status: 500 });
    }
}