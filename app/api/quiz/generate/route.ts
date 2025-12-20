import { db } from "@/config/db";
import { quizzesTable, coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { title, description, difficulty, questionCount, courseId, customTopic } =
      await request.json();

    let courseContent = "";

    if (courseId) {
      const course = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.cid, courseId))
        .limit(1);

      if (course.length === 0) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }

      courseContent = JSON.stringify(course[0].courseContent);
    }

    const prompt = `Generate a ${difficulty} difficulty quiz with ${questionCount} multiple choice questions about ${
      courseId
        ? `this course content: ${courseContent}`
        : `the topic: ${customTopic}`
    }.

Return the response in this exact JSON format:
{
  "questions": [
    {
      "id": "unique_id",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}

Requirements:
- Each question should have exactly 4 options
- correctAnswer should be the index (0-3) of the correct option
- Questions should be relevant and test understanding
- Explanations should be educational and detailed
- Make sure the JSON is valid and parseable`;

    const config = {
      responseMimeType: "text/plain",
    };

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config,
    });

    const rawResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    const rawJson = rawResponse?.replace("```json", "")?.replace("```", "");
    let quizData;

    try {
      quizData = JSON.parse(rawJson || "{}");
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const qid = uuidv4();
    await db.insert(quizzesTable).values({
      qid,
      title,
      description: description || null,
      courseId: courseId || null,
      customTopic: customTopic || null,
      questions: quizData.questions,
      totalQuestions: questionCount,
      difficulty,
      userEmail: user.primaryEmailAddress.emailAddress,
    });

    return NextResponse.json({ qid, message: "Quiz generated successfully" });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}