import {
    GoogleGenAI,
    GenerateContentResponse,
    Content
} from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ChatMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

export interface CourseContext {
  courseName: string;
  courseDescription: string;
  courseContent: any;
  completedChapters: any[];
  level: string;
  category: string;
}

export class GeminiAssistant {
  private defaultModel: string;

  constructor(modelName = "gemini-2.5-flash-lite") {
    this.defaultModel = modelName;
  }

  async generateResponse(
    messages: ChatMessage[],
    courseContext: CourseContext
  ): Promise<string> {
    try {
      const systemPrompt = this.createSystemPrompt(courseContext);

      const contents: Content[] = [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        ...messages.map((msg) => ({
          role: msg.role,
          parts: msg.parts.map((p) => ({ text: p.text })),
        })),
      ];

      const resp: GenerateContentResponse = await ai.models.generateContent({
        model: this.defaultModel,
        contents,
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: "text/plain",
        },
      });

      const candidate = resp.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text ?? resp.text;

      return text ?? "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("GeminiAssistant generateResponse error:", error);
      throw new Error("Failed to generate response from Gemini");
    }
  }

  private createSystemPrompt(courseContext: CourseContext): string {
    return `
        You are an intelligent course assistant for the course "${
            courseContext.courseName
            }".

        Course Information:
        - Course Name: ${courseContext.courseName}
        - Description: ${courseContext.courseDescription}
        - Level: ${courseContext.level}
        - Category: ${courseContext.category}
        - Total Chapters: ${
            courseContext.courseContent?.chapters?.length ?? "Not specified"
            }
        - Completed Chapters: ${courseContext.completedChapters?.length ?? 0}

        Course Content Overview:
        ${JSON.stringify(courseContext.courseContent, null, 2)}

        Your role:
        1. Help students understand the course material
        2. Answer questions related to the course content
        3. Provide explanations and examples
        4. Guide students through learning challenges
        5. Track progress and provide personalized recommendations
        6. Only answer questions related to this specific course
        7. If asked about topics outside this course, politely redirect

        Guidelines:
        - Be helpful, encouraging, educational
        - Provide clear, concise explanations
        - Use examples when helpful
        - Break down complex topics into simpler parts
        - Reference chapters or sections when relevant
        - Keep responses focused on the course material
    `.trim();
  }

  async generateConversationTitle(firstMessage: string): Promise<string> {
    try {
      const prompt = `Generate a short, descriptive title (max 6 words) for a conversation that starts with this message: "${firstMessage}". Return only the title.`;

      const resp = await ai.models.generateContent({
        model: this.defaultModel,
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        config: {
          responseMimeType: "text/plain",
        },
      });

      const candidate = resp.candidates?.[0];
      const title =
        candidate?.content?.parts?.[0]?.text?.trim() ?? resp?.text?.trim();

      return title?.replace(/^["']|["']$/g, "") ?? "New Conversation";
    } catch (error) {
      console.error("generateConversationTitle error:", error);
      return "New Conversation";
    }
  }
}

export const geminiAssistant = new GeminiAssistant();
