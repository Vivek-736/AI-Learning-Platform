import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { NextResponse } from "next/server";

const PROMPT = `
Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format.  

Add Chapter Name, Topic under each chapter, Duration for each chapter etc, in JSON format only.  

Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ]
      }
    ]
  }
}

, User Input:
`;

export async function POST(request: Request) {
  const user = await currentUser();
  const { courseId, ...formData } = await request.json();

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: "text/plain",
  };
  const model = "gemini-2.0-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: PROMPT + JSON.stringify(formData),
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    contents,
    config,
  });
  console.log(response?.candidates?.[0]?.content?.parts?.[0]?.text);

  const RawResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;
  const RawJson = RawResponse?.replace("```json", "")?.replace("```", "");

  const JSONResponse = JSON.parse(RawJson || "{}");

  // Generate Image
  const imagePrompt = JSONResponse?.course?.bannerImagePrompt;
  const bannerImageUrl = await GenerateImage(imagePrompt);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result = await db.insert(coursesTable).values({
    ...formData,
    courseJson: JSONResponse,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    cid: courseId,
    bannerImageUrl: bannerImageUrl
  });

  return NextResponse.json({ courseId: courseId });
}

const GenerateImage = async (imagePrompt: string) => {
  const BASE_URL = "https://aigurulab.tech";
  const result = await axios.post(
    BASE_URL + "/api/generate-image",
    {
      width: 1024,
      height: 1024,
      input: imagePrompt,
      model: "flux",
      aspectRatio: "16:9",
    },
    {
      headers: {
        "x-api-key": process.env.OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(result.data.image);
  return result.data.image;
};