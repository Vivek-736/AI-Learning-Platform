import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const user = await currentUser();

    if (courseId) {
        const result = await db.select().from(coursesTable)
        .where(eq(coursesTable.cid, courseId))
        
        console.log(result);
        return NextResponse.json(result[0]);
    } else {
        if (!user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json([]);
        }
        
        const result = await db.select().from(coursesTable).where(eq(coursesTable.userEmail, user.primaryEmailAddress.emailAddress)).orderBy(desc(coursesTable.id));

        console.log(result);
        return NextResponse.json(result);
    }
}