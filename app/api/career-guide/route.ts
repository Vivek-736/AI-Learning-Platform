import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const conversationHistory = messages
      .map((msg: { role: string; content: string }) => {
        const role = msg.role === "user" ? "User" : "Career Guide AI";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");

    const systemPrompt = `You are an intelligent Career Guide AI assistant for Fascinity, an AI-powered learning platform. Your role is to:

    1. **Understand Career Goals**: Ask thoughtful questions about the user's interests, current skills, education level, and career aspirations.

    2. **Suggest Relevant Courses**: Based on the conversation, recommend specific courses they should take. When suggesting courses, format them like this:
    - **Course Title**: [Descriptive name]
    - **Description**: [What they'll learn and why it's valuable]
    - **Key Topics**: [3-5 bullet points of main topics covered]
    - **Career Impact**: [How this course helps their career goals]
    - **Difficulty Level**: [Beginner/Intermediate/Advanced]

    3. **Provide Career Insights**: Share information about:
    - Industry trends and in-demand skills
    - Career paths and progression opportunities
    - Salary expectations and job market outlook
    - Skills gaps and how to bridge them

    4. **Be Conversational**: Be friendly, encouraging, and supportive. Use emojis sparingly but effectively (✨, 🎯, 💡, 🚀, 📚).

    5. **Ask Follow-up Questions**: Don't just give information - engage in a dialogue to better understand their needs.

    6. **Format Responses Well**: Use markdown formatting:
    - **Bold** for emphasis
    - *Italics* for subtle points
    - Bullet points for lists
    - Numbered lists for steps
    - Headers (###) for sections

    Remember: You're having a conversation with context. Reference previous messages and build on the discussion naturally.

    Current Conversation:
    ${conversationHistory}

    Respond as the Career Guide AI with helpful, personalized career guidance:`;

    const config = {
      responseMimeType: "text/plain",
    };
    const model = "gemini-2.5-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Error in career guide API:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}