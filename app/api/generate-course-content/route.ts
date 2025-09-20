import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const PROMPT = `Depending on Chapter name and Topic, generate content for each topic in HTML and give response in JSON format with following structure:
Schema: {
    chapterName: <>,
    {
        topic: <>,
        content: <>
    }
};
User Input:
`

export async function POST(request: Request) {
    const { courseJson, courseTitle, courseId } = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promises = courseJson?.chapters?.map(async (chapter: any) => {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        const config = {
            responseMimeType: 'text/plain'
        };
        const model = 'gemini-2.0-flash';
        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: PROMPT + JSON.stringify(chapter),
                    }
                ]
            }
        ];
        
        const response = await ai.models.generateContent({
            model,
            contents,
            config
        })
        console.log(response?.candidates?.[0]?.content?.parts?.[0]?.text);

        const RawResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        const RawJson = RawResponse?.replace("```json", "")?.replace("```", "");
        const JSONResponse = JSON.parse(RawJson || "{}");

        // GET Youtube Videos
        return JSONResponse;
    })

    const CourseContent = await Promise.all(promises);

    return NextResponse.json({
        courseName: courseTitle,
        CourseContent: CourseContent
    })
}