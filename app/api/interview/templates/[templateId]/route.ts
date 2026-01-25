import { db } from "@/config/db";
import { interviewTemplatesTable, coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY6!,
});

export async function GET() {
  try {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return new Response("Unauthorized", { status: 401 });
    }

    const templates = await db
      .select({
        templateId: interviewTemplatesTable.templateId,
        title: interviewTemplatesTable.title,
        description: interviewTemplatesTable.description,
        courseId: interviewTemplatesTable.courseId,
        courseName: coursesTable.name,
        difficulty: interviewTemplatesTable.difficulty,
        estimatedDuration: interviewTemplatesTable.estimatedDuration,
        isActive: interviewTemplatesTable.isActive,
        createdAt: interviewTemplatesTable.createdAt,
      })
      .from(interviewTemplatesTable)
      .innerJoin(
        coursesTable,
        eq(interviewTemplatesTable.courseId, coursesTable.cid)
      )
      .where(eq(interviewTemplatesTable.creatorEmail, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(interviewTemplatesTable.createdAt));

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { title, description, courseId, difficulty, estimatedDuration } =
      await request.json();

    const course = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId))
      .limit(1);

    if (course.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseContent = JSON.stringify(course[0].courseContent);
    const courseName = course[0].name;

    const prompt = `Generate interview questions based on this course content for a ${difficulty} difficulty voice interview lasting ${estimatedDuration} minutes.

Course: ${courseName}
Content: ${courseContent}

Generate questions that assess:
1. Technical knowledge from the course
2. Practical application skills  
3. Problem-solving abilities
4. Communication skills

Return ONLY a JSON object in this format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Tell me about your understanding of [concept from course]",
      "type": "technical",
      "expectedTopics": ["topic1", "topic2"],
      "followUp": "Can you give me a practical example?"
    }
  ],
  "skillsToAssess": ["technical", "communication", "problem_solving", "practical_application"]
}

Generate 8-12 questions appropriate for ${estimatedDuration} minutes.`;

    const config = { responseMimeType: "text/plain" };
    const contents = [{ role: "user", parts: [{ text: prompt }] }];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config,
    });

    const rawResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    const rawJson = rawResponse
      ?.replace("```json", "")
      ?.replace("```", "")
      ?.trim();

    let questionsData;
    try {
      questionsData = JSON.parse(rawJson || "{}");
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to generate questions" + err },
        { status: 500 }
      );
    }

    const templateId = uuidv4();
    await db.insert(interviewTemplatesTable).values({
      templateId,
      title,
      description: description || `Interview for ${courseName}`,
      courseId,
      creatorEmail: user.primaryEmailAddress.emailAddress,
      difficulty,
      estimatedDuration,
      questions: questionsData.questions,
      skillsToAssess:
        questionsData.skillsToAssess || [
          "technical",
          "communication",
          "problem_solving",
        ],
    });

    return NextResponse.json({
      templateId,
      message: "Interview template created successfully",
    });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}