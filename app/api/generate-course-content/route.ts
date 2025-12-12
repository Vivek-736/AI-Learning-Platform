import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const PROMPT = `You are an expert educational content creator. Generate comprehensive, visually rich learning content for each topic.

**IMPORTANT FORMATTING RULES:**
1. Use clean HTML5 semantic markup
2. Include various content sections conditionally based on topic complexity
3. Make content engaging with real-world examples, diagrams, code snippets
4. Ensure mobile-responsive design with proper spacing

**Required JSON Structure:**
{
    "chapterName": "<chapter_name>",
    "topics": [
        {
            "topic": "<topic_name>",
            "content": "<main_html_content>",
            "keyTakeaways": ["point1", "point2", "point3"],
            "practicalExample": "<html_content_with_example>",
            "codeSnippet": "<pre><code>code here</code></pre>",
            "diagram": "<mermaid_diagram_syntax>",
            "quiz": [{"question": "...", "options": ["a", "b", "c"], "correct": 0}]
        }
    ]
}

**Content Guidelines:**
- Use <h3>, <h4> for subsections
- Use <p> for paragraphs with proper spacing
- Use <ul>, <ol> for lists
- Use <strong>, <em> for emphasis
- Include <blockquote> for important notes/tips
- Add <table> for comparisons when needed
- Use <pre><code> for code blocks
- Create **Mermaid diagrams** for visual explanations (flowcharts, sequence diagrams, class diagrams, etc.)
- Add real-world analogies and examples
- Include "💡 Pro Tip:", "⚠️ Common Mistake:", "🎯 Key Point:" callouts

**CRITICAL MERMAID DIAGRAM RULES:**

1. **Always use proper arrow syntax:**
   - Use --> for flowcharts (NOT --)
   - Use ->> for sequence diagrams
   - Use <|-- for inheritance in class diagrams

2. **Proper node syntax:**
   - Square brackets: [Text] for rectangles
   - Curly braces: {Text} for diamonds/decisions  
   - Round parentheses: (Text) for rounded rectangles
   - Double brackets: [[Text]] for subroutines
   - Cylindrical: [(Text)] for databases

3. **Label edges correctly:**
   - Use |Label| between arrows: A -->|Yes| B
   - NOT: A -- Yes --> B (WRONG!)

4. **Valid Mermaid Examples:**

Simple Flowchart:
flowchart TD
    A[Start] --> B{Is Valid?}
    B -->|Yes| C[Process]
    B -->|No| D[Error]
    C --> E[End]
    D --> E

Algorithm Flowchart:
flowchart TD
    Start[Start] --> Input[Input Array]
    Input --> Check{Array Empty?}
    Check -->|Yes| ReturnError[Return Error]
    Check -->|No| Process[Process Items]
    Process --> Output[Return Result]
    ReturnError --> End[End]
    Output --> End

Sequence Diagram:
sequenceDiagram
    participant U as User
    participant S as System
    participant D as Database
    U->>S: Send Request
    S->>D: Query Data
    D-->>S: Return Data
    S-->>U: Send Response

Class Diagram:
classDiagram
    class Shape {
        +int x
        +int y
        +draw()
    }
    class Circle {
        +int radius
        +calculateArea()
    }
    Shape <|-- Circle

State Diagram:
stateDiagram-v2
    [*] --> Idle
    Idle --> Active: Start
    Active --> Processing: Submit
    Processing --> Complete: Success
    Processing --> Error: Failure
    Complete --> [*]
    Error --> Idle: Retry

**Example Format:**
<h3>Understanding the Concept</h3>
<p>Clear explanation here...</p>

<blockquote class="tip">💡 <strong>Pro Tip:</strong> Practical advice here</blockquote>

<h4>How It Works</h4>
<p>Step-by-step explanation...</p>

<table>
  <thead><tr><th>Feature</th><th>Description</th></tr></thead>
  <tbody><tr><td>Item</td><td>Details</td></tr></tbody>
</table>

<pre><code>// Code example
function example() {
  return "clear code";
}
</code></pre>

**Make content:**
- Comprehensive yet concise
- Visually structured with VALID Mermaid diagrams
- Practical and applicable
- Easy to scan on mobile
- Rich with examples

**CRITICAL:** 
- For "diagram" field, use ONLY raw Mermaid syntax (NO backticks, NO markdown)
- ALWAYS use --> arrows (NOT --)
- ALWAYS use |Label| for edge labels (NOT -- Label -->)
- Test your Mermaid syntax mentally before including it
- If unsure, use a simple flowchart with proper --> arrows

Return valid JSON with properly escaped characters. No trailing commas.

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
            const model = 'gemini-2.5-flash-lite';
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