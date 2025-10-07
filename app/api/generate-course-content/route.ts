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
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

const GetYoutubeVideos = async (topic: string) => {
    try {
        const searchParams = {
            part: 'snippet',
            q: topic,
            type: 'video',
            maxResults: 10,
            order: 'relevance',
            videoDuration: 'medium',
            videoDefinition: 'any',
            key: process.env.YOUTUBE_API_KEY,
        };
        
        const searchRes = await axios.get(YOUTUBE_BASE_URL, { params: searchParams });
        const searchResults = searchRes.data.items || [];

        if (searchResults.length === 0) {
            return [];
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const videoIds = searchResults.map((item: any) => item.id.videoId).join(',');

        const videoParams = {
            part: 'snippet,contentDetails,statistics',
            id: videoIds,
            key: process.env.YOUTUBE_API_KEY,
        };

        const videoRes = await axios.get(YOUTUBE_VIDEOS_URL, { params: videoParams });
        const videoDetails = videoRes.data.items || [];

        const processedVideos = videoDetails
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((video: any) => ({
                videoId: video.id,
                title: video.snippet.title,
                viewCount: parseInt(video.statistics.viewCount || '0', 10),
                duration: video.contentDetails.duration,
            }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((video: any) => {
                const duration = parseDuration(video.duration);
                return duration >= 60;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .sort((a: any, b: any) => b.viewCount - a.viewCount)
            .slice(0, 3)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((video: any) => ({
                videoId: video.videoId,
                title: video.title,
            }));

        return processedVideos;
    } catch (error) {
        console.error('Error fetching YouTube videos for topic:', topic, error);
        return [];
    }
};

const parseDuration = (duration: string): number => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    
    return hours * 3600 + minutes * 60 + seconds;
};