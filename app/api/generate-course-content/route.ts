import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const PROMPT = `Generate content for each topic based on the Chapter name and Topic, returning the response in valid JSON format with the following structure:
{
    "chapterName": "<chapter_name>",
    "topics": [
        {
            "topic": "<topic_name>",
            "content": "<html_content>"
        }
    ]
}
Ensure the response is valid JSON with properly escaped characters and no trailing commas or invalid syntax.
User Input: `;

export async function POST(request: Request) {
    try {
        const { courseJson, courseTitle, courseId } = await request.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promises = courseJson?.chapters?.map(async (chapter: any) => {
            const ai = new GoogleGenAI({
                apiKey: process.env.GEMINI_API_KEY,
            });
            const config = {
                responseMimeType: 'application/json',
            };
            const model = 'gemini-2.0-flash';
            const contents = [
                {
                    role: 'user',
                    parts: [
                        {
                            text: PROMPT + JSON.stringify(chapter),
                        },
                    ],
                },
            ];

            const response = await ai.models.generateContent({
                model,
                contents,
                config,
            });

            const RawResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!RawResponse) {
                console.error('No response from Gemini API for chapter:', chapter?.chapterName);
                return {
                    youtubeVideo: [],
                    courseData: { chapterName: chapter?.chapterName, topics: [] },
                };
            }

            const RawJson = RawResponse.replace(/```json/g, '')
                .replace(/```/g, '')
                .replace(/[\n\r]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            let JSONResponse;
            try {
                JSONResponse = JSON.parse(RawJson);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (parseError: any) {
                console.error('JSON Parse Error for chapter:', chapter?.chapterName);
                console.error('Raw JSON:', RawJson);
                throw new Error(`Failed to parse JSON: ${parseError.message}`);
            }

            if (!JSONResponse.chapterName || !Array.isArray(JSONResponse.topics)) {
                console.error('Invalid JSON structure for chapter:', chapter?.chapterName);
                console.error('Parsed JSON:', JSONResponse);
                throw new Error('Invalid JSON structure from Gemini API');
            }

            // GET YouTube Videos
            const youtubeData = await GetYoutubeVideos(chapter?.chapterName);

            return {
                youtubeVideo: youtubeData,
                courseData: JSONResponse,
            };
        });

        const CourseContent = await Promise.all(promises);

        await db.update(coursesTable)
            .set({
                courseContent: CourseContent,
            })
            .where(eq(coursesTable.cid, courseId));

        return NextResponse.json({
            courseName: courseTitle,
            CourseContent: CourseContent,
        });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error in POST /api/generate-course-content:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const GetYoutubeVideos = async (topic: string) => {
    try {
        const params = {
            part: 'snippet',
            q: topic,
            type: 'video',
            maxResults: 3,
            key: process.env.YOUTUBE_API_KEY,
        };
        const res = await axios.get(YOUTUBE_BASE_URL, { params });
        const youtubeVideoListRes = res.data.items || [];
        const youtubeVideoList: { videoId: string; title: string }[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        youtubeVideoListRes.forEach((item: any) => {
            if (item.id?.videoId && item.snippet?.title) {
                youtubeVideoList.push({
                    videoId: item.id.videoId,
                    title: item.snippet.title,
                });
            }
        });

        console.log('YouTube Videos for topic:', topic, youtubeVideoList);
        return youtubeVideoList;
    } catch (error) {
        console.error('Error fetching YouTube videos for topic:', topic, error);
        return [];
    }
};