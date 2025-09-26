import { db } from "@/config/db";
import { interviewSessionsTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;

    const result = await db
      .select()
      .from(interviewSessionsTable)
      .where(eq(interviewSessionsTable.sessionId, sessionId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const session = result[0];

    if (session.status === "completed" && !session.overallScore) {
      await analyzeSession(sessionId);

      const updatedResult = await db
        .select()
        .from(interviewSessionsTable)
        .where(eq(interviewSessionsTable.sessionId, sessionId))
        .limit(1);

      return NextResponse.json(formatResults(updatedResult[0]));
    }

    return NextResponse.json(formatResults(session));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

async function analyzeSession(sessionId: string) {
  const session = await db
    .select()
    .from(interviewSessionsTable)
    .where(eq(interviewSessionsTable.sessionId, sessionId))
    .limit(1);

  if (session.length === 0) return;

  const transcript = session[0].conversationTranscript as any[];
  const conversationText =
    transcript
      ?.filter((msg: any) => msg.role !== "system")
      .map(
        (msg: any) =>
          `${msg.role === "user" ? "Candidate" : "Interviewer"}: ${msg.content}`
      )
      .join("\n") || "No conversation recorded";

  const prompt = `Analyze this interview conversation and provide detailed feedback:
    Conversation:
    ${conversationText}

    Provide analysis in this JSON format:
    {
      "overallScore": 85,
      "skillScores": {
        "technical": 82,
        "communication": 88,
        "problem_solving": 80,
        "confidence": 85
      },
      "detailedFeedback": {
        "strengths": ["Clear communication", "Good technical knowledge"],
        "improvements": ["Could provide more specific examples"],
        "recommendations": ["Practice explaining complex concepts"],
        "overallFeedback": "Strong performance with clear communication..."
      }
    }
    Rate each skill 0-100. Be constructive and encouraging.`;

  try {
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
    const rawJson = rawResponse
      ?.replace("```json", "")
      ?.replace("```", "")
      ?.trim();

    let feedback;
    try {
      feedback = JSON.parse(rawJson || "{}");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      feedback = {
        overallScore: 75,
        skillScores: { technical: 75, communication: 75 },
        detailedFeedback: {
          strengths: ["Completed the interview"],
          improvements: ["Continue practicing"],
          recommendations: ["Keep learning"],
          overallFeedback: "Thank you for completing the interview.",
        },
      };
    }

    await db
      .update(interviewSessionsTable)
      .set({
        overallScore: feedback.overallScore,
        skillScores: feedback.skillScores,
        detailedFeedback: feedback.detailedFeedback,
      })
      .where(eq(interviewSessionsTable.sessionId, sessionId));
  } catch (error) {
    console.error("Error analyzing session:", error);
  }
}

function formatResults(session: any) {
  return {
    sessionId: session.sessionId,
    candidateName: session.candidateName,
    candidateEmail: session.candidateEmail,
    duration: session.duration || 0,
    overallScore: session.overallScore || 0,
    skillScores: session.skillScores || {},
    detailedFeedback: session.detailedFeedback || {
      strengths: [],
      improvements: [],
      recommendations: [],
      overallFeedback: "Analysis in progress...",
    },
    completedAt: session.completedAt,
  };
}