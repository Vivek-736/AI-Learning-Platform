import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { codingAttemptsTable, codingChallengesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { challengeId, userEmail, solutions, timeSpent } = await req.json();

        if (!challengeId || !userEmail) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const challenge = await db.select()
            .from(codingChallengesTable)
            .where(eq(codingChallengesTable.challengeId, challengeId))
            .limit(1);

        if (!challenge || challenge.length === 0) {
            return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const problems = challenge[0].problems as any[];

        let totalScore = 0;
        let problemsAttempted = 0;
        let problemsSolved = 0;
        let testCasesPassed = 0;
        let testCasesFailed = 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const evaluatedSolutions = await Promise.all(solutions.map(async (solution: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const problem = problems.find((p: any) => p.problemId === solution.problemId);
            if (!problem) return solution;

            if (solution.code && solution.code.trim()) {
                problemsAttempted++;
            }

            // Execute code using the execute API
            try {
                const executeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/coding/execute`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code: solution.code,
                        language: solution.language,
                        testCases: problem.testCases,
                        problemTitle: problem.title
                    })
                });

                const executeData = await executeResponse.json();
                const testResults = executeData.results || [];
                const passedCount = executeData.passedCount || 0;
                const totalTests = executeData.totalTests || testResults.length;

                testCasesPassed += passedCount;
                testCasesFailed += (totalTests - passedCount);

                const score = Math.round((passedCount / totalTests) * 25); // 25 points per problem
                totalScore += score;

                if (passedCount === totalTests) {
                    problemsSolved++;
                }

                return {
                    ...solution,
                    testResults,
                    score,
                    passedTestCases: passedCount,
                    totalTestCases: totalTests,
                    feedback: executeData.feedback // Include detailed per-problem feedback
                };
            } catch (error) {
                console.error("Error executing solution:", error);
                // Fallback to marking as failed
                const totalTests = problem.testCases?.length || 5;
                testCasesFailed += totalTests;
                return {
                    ...solution,
                    testResults: [],
                    score: 0,
                    passedTestCases: 0,
                    totalTestCases: totalTests,
                    error: "Failed to execute code"
                };
            }
        }));

        const feedback = generateFeedback(
            totalScore,
            problemsAttempted,
            problemsSolved,
            testCasesPassed,
            testCasesFailed,
            timeSpent,
            challenge[0].difficulty as string
        );

        const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const attempt = await db.insert(codingAttemptsTable).values({
            attemptId,
            challengeId,
            userEmail,
            submittedAt: new Date(),
            timeSpent,
            status: 'submitted',
            solutions: evaluatedSolutions,
            totalScore,
            problemsAttempted,
            problemsSolved,
            testCasesPassed,
            testCasesFailed,
            feedback
        }).returning();

        return NextResponse.json({
            success: true,
            attempt: attempt[0],
            feedback
        });

    } catch (error) {
        console.error("Error submitting attempt:", error);
        return NextResponse.json(
            { error: "Failed to submit attempt" },
            { status: 500 }
        );
    }
}

function generateFeedback(
    totalScore: number,
    problemsAttempted: number,
    problemsSolved: number,
    testCasesPassed: number,
    testCasesFailed: number,
    timeSpent: number,
    difficulty: string
) {
    const percentage = totalScore;
    const timeInMinutes = Math.round(timeSpent / 60);

    let performanceLevel = "";
    let overallComment = "";

    if (percentage >= 90) {
        performanceLevel = "Exceptional";
        overallComment = "Outstanding performance! You've demonstrated excellent problem-solving skills and coding proficiency.";
    } else if (percentage >= 75) {
        performanceLevel = "Excellent";
        overallComment = "Great job! You've shown strong understanding of DSA concepts and good coding practices.";
    } else if (percentage >= 60) {
        performanceLevel = "Good";
        overallComment = "Well done! You have a solid grasp of the concepts. Focus on optimizing your solutions.";
    } else if (percentage >= 40) {
        performanceLevel = "Average";
        overallComment = "Decent attempt. There's room for improvement in both problem-solving approach and implementation.";
    } else {
        performanceLevel = "Needs Improvement";
        overallComment = "Keep practicing! Focus on understanding the fundamentals and try more problems.";
    }

    const strengths = [];
    const areasForImprovement = [];

    if (problemsSolved >= 3) {
        strengths.push("Excellent problem completion rate");
    }
    if (timeInMinutes <= 45) {
        strengths.push("Efficient time management");
    }
    if (testCasesPassed > testCasesFailed * 2) {
        strengths.push("Good attention to edge cases");
    }

    if (problemsSolved < 2) {
        areasForImprovement.push("Work on completing more problems");
    }
    if (timeInMinutes > 55) {
        areasForImprovement.push("Practice for better time management");
    }
    if (testCasesFailed > testCasesPassed) {
        areasForImprovement.push("Focus on handling edge cases and corner scenarios");
    }

    if (strengths.length === 0) {
        strengths.push("Attempted the challenge");
    }
    if (areasForImprovement.length === 0) {
        areasForImprovement.push("Keep practicing to maintain consistency");
    }

    return {
        performanceLevel,
        overallComment,
        score: totalScore,
        maxScore: 100,
        percentage,
        problemsAttempted,
        problemsSolved,
        totalProblems: 4,
        testCasesPassed,
        testCasesFailed,
        totalTestCases: testCasesPassed + testCasesFailed,
        timeSpent: timeInMinutes,
        timeLimit: 60,
        difficulty,
        strengths,
        areasForImprovement,
        recommendations: [
            "Practice more problems of similar difficulty",
            "Review solutions of problems you couldn't solve",
            "Focus on time complexity optimization",
            "Study common DSA patterns and techniques"
        ]
    };
}