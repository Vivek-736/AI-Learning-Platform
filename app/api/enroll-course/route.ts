import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { courseId } = await request.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
        return new Response('User email not found', { status: 401 });
    }

    const enrollCourses = await db.select().from(enrollCourseTable)
        .where(and(eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress), eq(enrollCourseTable.cid, courseId)));

    if (enrollCourses.length == 0) {
        const result = await db.insert(enrollCourseTable)
        .values({
            cid: courseId,
            userEmail: user.primaryEmailAddress.emailAddress
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        }).returning(enrollCourseTable);

        return NextResponse.json(result);
    }

    return NextResponse.json({ 'res': 'Already Enrolled' });
}

export async function GET() {
    const user = await currentUser();
    
    const result = await db.select().from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress?.emailAddress || ''))
        .orderBy(desc(enrollCourseTable.id));

    return NextResponse.json(result);
}