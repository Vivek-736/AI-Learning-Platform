import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const PROMPT = `Depending on Chapter name and Topic, generate content for each topic in HTML and give response in JSON format with following structure:
Schema: {
    chapterName: <>,
    {
        topic: <>,
        content: <>
    }
};
User Input:`

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
        const youtubeData = await GetYoutubeVideos(chapter?.chapterName);

        return {
            youtubeVideo: youtubeData,
            courseData: JSONResponse
        };
    })

    const CourseContent = await Promise.all(promises);

    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dbRes = await db.update(coursesTable).set({
        courseContent: CourseContent
    }).where(eq(coursesTable.cid, courseId))

    return NextResponse.json({
        courseName: courseTitle,
        CourseContent: CourseContent
    })
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GetYoutubeVideos = async (topic: any) => {
    const params = {
        part: 'snippet',
        q: topic,
        type: 'video',
        maxResult: 3,
        key: process.env.YOUTUBE_API_KEY
    }
    const res = await axios.get(YOUTUBE_BASE_URL, { params });
    const youtubeVideoListRes = res.data.items;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const youtubeVideoList: { videoId: any; title: any; }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    youtubeVideoListRes.forEach((item: any) => {
        const data = {
            videoId: item.id?.videoId,
            title: item.snippet?.title
        }
        youtubeVideoList.push(data);
    })
    console.log(youtubeVideoList);
    return youtubeVideoList;
}