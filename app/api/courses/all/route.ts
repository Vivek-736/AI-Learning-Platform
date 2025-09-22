import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, notInArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();
        
        if (!user?.primaryEmailAddress?.emailAddress) {
            return new Response('User email not found', { status: 401 });
        }

        const enrolledCourses = await db.select({ cid: enrollCourseTable.cid })
            .from(enrollCourseTable)
            .where(eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress));

        const enrolledCourseIds = enrolledCourses.map(course => course.cid);

        let allCourses;

        if (enrolledCourseIds.length > 0) {
            allCourses = await db.select().from(coursesTable)
                .where(notInArray(coursesTable.cid, enrolledCourseIds))
                .orderBy(desc(coursesTable.id));
        } else {
            allCourses = await db.select().from(coursesTable)
                .orderBy(desc(coursesTable.id));
        }

        return NextResponse.json(allCourses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        
        return new Response('Internal Server Error', { status: 500 });
    }
}