import { db } from "@/config/db";
import { interviewLinksTable, interviewTemplatesTable, coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ linkId: string }> }) {
    try {
        const { linkId } = await context.params;

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
            skillsToAssess: interviewTemplatesTable.skillsToAssess,
        })
        .from(interviewLinksTable)
        .innerJoin(interviewTemplatesTable, eq(interviewLinksTable.templateId, interviewTemplatesTable.templateId))
        .innerJoin(coursesTable, eq(interviewTemplatesTable.courseId, coursesTable.cid))
        .where(eq(interviewLinksTable.linkId, linkId))
        .limit(1);

        if (result.length === 0 || !result[0].isActive) {
            return NextResponse.json({ error: "Interview not found or inactive" }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Error fetching interview:", error);
        return NextResponse.json({ error: "Failed to fetch interview: " + (error as Error).message }, { status: 500 });
    }
}