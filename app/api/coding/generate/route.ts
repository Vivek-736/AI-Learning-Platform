import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { codingChallengesTable, usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

const DSA_TOPICS = [
    "Arrays", "Strings", "Linked Lists", "Stacks", "Queues",
    "Trees", "Binary Search Trees", "Heaps", "Graphs", "Hashing",
    "Dynamic Programming", "Greedy Algorithms", "Backtracking",
    "Sorting", "Searching", "Bit Manipulation", "Recursion",
    "Sliding Window", "Two Pointers", "Divide and Conquer"
];

export async function POST(req: NextRequest) {
    try {
        const { userEmail, testType, topic, difficulty } = await req.json();

        if (!userEmail || !testType || !difficulty) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (testType === 'individual-topic' && !topic) {
            return NextResponse.json(
                { error: "Topic is required for individual topic test" },
                { status: 400 }
            );
        }

        const user = await db.select().from(usersTable).where(eq(usersTable.email, userEmail)).limit(1);
        if (!user || user.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const challengeId = `chall_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY1,
        });
        const config = {
            responseMimeType: 'application/json',
        };
        const model = 'gemini-2.5-flash';

        let prompt = "";
        if (testType === 'full-syllabus') {
            prompt = `Generate 4 coding problems for a full DSA syllabus test with ${difficulty} difficulty.
            
Include problems from different topics: Arrays, Strings, Trees, and Dynamic Programming.

For each problem, provide:
1. title (concise, descriptive)
2. description (clear problem statement)
3. difficulty (${difficulty})
4. topic
5. constraints (e.g., "1 <= n <= 10^5")
6. inputFormat (description of input structure)
7. outputFormat (description of expected output)
8. sampleInput (example input as string)
9. sampleOutput (expected output as string)
10. explanation (brief explanation of sample case)
11. testCases (array of 5 test cases, each with input and expectedOutput as strings)
12. hints (array of 2-3 progressive hints)
13. timeComplexity (expected optimal solution complexity)
14. spaceComplexity (expected optimal solution space complexity)

Return ONLY a valid JSON array of 4 problems, no markdown formatting.`;
        } else {
            prompt = `Generate 4 coding problems focused on ${topic} with ${difficulty} difficulty.

All problems should be related to ${topic} topic but test different concepts and approaches.

For each problem, provide:
1. title (concise, descriptive)
2. description (clear problem statement)
3. difficulty (${difficulty})
4. topic (${topic})
5. constraints (e.g., "1 <= n <= 10^5")
6. inputFormat (description of input structure)
7. outputFormat (description of expected output)
8. sampleInput (example input as string)
9. sampleOutput (expected output as string)
10. explanation (brief explanation of sample case)
11. testCases (array of 5 test cases, each with input and expectedOutput as strings)
12. hints (array of 2-3 progressive hints)
13. timeComplexity (expected optimal solution complexity)
14. spaceComplexity (expected optimal solution space complexity)

Return ONLY a valid JSON array of 4 problems, no markdown formatting.`;
        }

        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
        ];

        const result = await ai.models.generateContent({
            model,
            contents,
            config,
        });

        const problems = JSON.parse(result.text || '[]');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const problemsWithIds = problems.map((problem: any, index: number) => {
            // Fix testCases if AI returns 'output' instead of 'expectedOutput'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const testCases = problem.testCases?.map((tc: any) => ({
                input: tc.input || tc.Input || "",
                expectedOutput: tc.expectedOutput || tc.output || tc.Output || ""
            })) || [];

            return {
                ...problem,
                problemId: `prob_${challengeId}_${index + 1}`,
                order: index + 1,
                testCases
            };
        });

        const challenge = await db.insert(codingChallengesTable).values({
            challengeId,
            title: testType === 'full-syllabus' 
                ? `Full Syllabus ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Test`
                : `${topic} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Test`,
            description: testType === 'full-syllabus'
                ? `A comprehensive test covering multiple DSA topics`
                : `Focused test on ${topic} concepts`,
            testType,
            topic: testType === 'individual-topic' ? topic : null,
            difficulty,
            timeLimit: 60,
            totalProblems: 4,
            problems: problemsWithIds,
            userEmail
        }).returning();

        return NextResponse.json({
            success: true,
            challenge: challenge[0]
        });

    } catch (error) {
        console.error("Error generating coding challenge:", error);
        return NextResponse.json(
            { error: "Failed to generate challenge", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        return NextResponse.json({
            topics: DSA_TOPICS,
            testTypes: ['full-syllabus', 'individual-topic'],
            difficulties: ['easy', 'medium', 'hard']
        });
    } catch (error) {
        console.error("Error fetching topics:", error);
        return NextResponse.json(
            { error: "Failed to fetch topics" },
            { status: 500 }
        );
    }
}