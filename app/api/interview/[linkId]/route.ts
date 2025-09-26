import { db } from "@/config/db";
import { interviewLinksTable, interviewTemplatesTable, coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { linkId: string } }) {
    try {
        const result = await db.select({
            linkId: interviewLinksTable.linkId,
            templateId: interviewLinksTable.templateId,
            title: interviewLinksTable.title,
            instructions: interviewLinksTable.instructions,
            isActive: interviewLinksTable.isActive,
            templateTitle: interviewTemplatesTable.title,
            courseName: coursesTable.name,
            difficulty: interviewTemplatesTable.difficulty,
            estimatedDuration: interviewTemplatesTable.estimatedDuration,
            questions: interviewTemplatesTable.questions,
            skillsToAssess: interviewTemplatesTable.skillsToAssess
        })
        .from(interviewLinksTable)
        .innerJoin(interviewTemplatesTable, eq(interviewLinksTable.templateId, interviewTemplatesTable.templateId))
        .innerJoin(coursesTable, eq(interviewTemplatesTable.courseId, coursesTable.cid))
        .where(eq(interviewLinksTable.linkId, params.linkId))
        .limit(1);

        if (result.length === 0 || !result[0].isActive) {
            return NextResponse.json({ error: 'Interview not found or inactive' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch interview' + error }, { status: 500 });
    }
}