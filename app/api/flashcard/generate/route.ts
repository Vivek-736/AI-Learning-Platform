import { db } from "@/config/db";
import { flashcardSetsTable, coursesTable } from "@/config/schema";
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

    const { title, description, difficulty, cardCount, courseId, customTopic } =
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

    const prompt = `Generate ${cardCount} flashcards with ${difficulty} difficulty about ${
      courseId
        ? `this course content: ${courseContent}`
        : `the topic: ${customTopic}`
    }.

Return the response in this exact JSON format:
{
  "flashcards": [
    {
      "id": "unique_id",
      "front": "Question or concept on the front of the card",
      "back": "Answer or explanation on the back of the card",
      "explanation": "Additional context or detailed explanation"
    }
  ]
}

Requirements:
- Front should be concise questions, terms, or concepts
- Back should provide clear, accurate answers or definitions
- Explanations should add valuable context or examples
- Focus on key concepts and important details
- Make cards useful for active recall and spaced repetition
- Ensure JSON is valid and parseable`;

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
      model: "gemini-2.0-flash",
      contents,
      config,
    });

    const rawResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    const rawJson = rawResponse?.replace("```json", "")?.replace("```", "");
    let flashcardData;

    try {
      flashcardData = JSON.parse(rawJson || "{}");
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response" }, { status: 500 }
      );
    }

    const fid = uuidv4();
    await db.insert(flashcardSetsTable).values({
      fid,
      title,
      description: description || null,
      courseId: courseId || null,
      customTopic: customTopic || null,
      flashcards: flashcardData.flashcards,
      totalCards: cardCount,
      difficulty,
      userEmail: user.primaryEmailAddress.emailAddress,
    });

    return NextResponse.json({ fid, message: "Flashcards generated successfully" });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}