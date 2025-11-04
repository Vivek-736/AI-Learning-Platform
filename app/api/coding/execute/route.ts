import { NextRequest, NextResponse } from "next/server";

const PISTON_API_URL = "https://emkc.org/api/v2/piston";

const PISTON_LANGUAGES: Record<string, { language: string; version: string }> = {
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
    cpp: { language: "c++", version: "10.2.0" },
    c: { language: "c", version: "10.2.0" }
};

interface TestCase {
    input: string;
    expectedOutput: string;
}

export async function POST(req: NextRequest) {
    try {
        const { code, language, testCases, problemTitle } = await req.json();

        if (!code || !language || !testCases) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Debug logging
        console.log("Received test cases:", JSON.stringify(testCases, null, 2));
        console.log("Problem title:", problemTitle);

        return await executePiston(code, language, testCases, problemTitle);
    } catch (error) {
        console.error("Error in code execution:", error);
        return NextResponse.json(
            { error: "Failed to execute code" },
            { status: 500 }
        );
    }
}

// Helper to add delay between API calls to avoid rate limiting
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to process test result
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processTestResult(result: any, testCase: TestCase, index: number, executionTime: number) {
    // Check for rate limiting
    if (result.message && result.message.includes("Requests limited")) {
        return {
            testCaseNumber: index + 1,
            passed: false,
            input: testCase.input || "",
            expectedOutput: testCase.expectedOutput || "",
            actualOutput: "",
            error: "Rate limit exceeded. Please try again.",
            executionTime: 0,
            memory: 0
        };
    }

    // Check for compilation errors
    if (result.compile && result.compile.code !== 0) {
        return {
            testCaseNumber: index + 1,
            passed: false,
            input: testCase.input || "",
            expectedOutput: testCase.expectedOutput || "",
            actualOutput: result.compile.output || "Compilation failed",
            error: result.compile.stderr || result.compile.output || "Compilation error",
            executionTime,
            memory: 0
        };
    }

    // Check for runtime errors
    if (result.run && result.run.code !== 0 && result.run.signal) {
        return {
            testCaseNumber: index + 1,
            passed: false,
            input: testCase.input || "",
            expectedOutput: testCase.expectedOutput || "",
            actualOutput: result.run.output || "Runtime error",
            error: result.run.stderr || result.run.output || `Runtime error (signal: ${result.run.signal})`,
            executionTime,
            memory: 0
        };
    }

    // Get output - Piston returns output in either stdout or output field
    const actualOutput = result.run 
        ? ((result.run.stdout || result.run.output || "").trim())
        : "";
    const expectedOutput = (testCase.expectedOutput || "").trim();
    const passed = actualOutput === expectedOutput;

    // Check for stderr (warnings/errors that don't stop execution)
    const hasError = result.run && result.run.stderr && result.run.stderr.trim().length > 0;

    return {
        testCaseNumber: index + 1,
        passed,
        input: testCase.input || "",
        expectedOutput: testCase.expectedOutput || "",
        actualOutput,
        error: hasError ? result.run.stderr : null,
        executionTime,
        memory: 0
    };
}

// Check if code is just boilerplate/empty
function isBoilerplateCode(code: string, language: string): boolean {
    const trimmedCode = code.trim();
    
    // Check for completely empty or only whitespace
    if (!trimmedCode || trimmedCode.length < 20) return true;
    
    // Language-specific boilerplate patterns
    const boilerplatePatterns: Record<string, RegExp[]> = {
        python: [
            /^def\s+\w+\([^)]*\):\s*pass\s*$/m,
            /^def\s+\w+\([^)]*\):\s*#.*$/m,
            new RegExp('^def\\s+\\w+\\([^)]*\\):\\s*""".*"""\\s*pass\\s*$', 'ms'),
        ],
        java: [
            new RegExp('public\\s+static\\s+void\\s+main.*{\\s*}\\s*$', 'ms'),
            new RegExp('public\\s+\\w+\\s+\\w+\\([^)]*\\)\\s*{\\s*}\\s*$', 'ms'),
        ],
        cpp: [
            new RegExp('int\\s+main\\s*\\([^)]*\\)\\s*{\\s*return\\s+0;\\s*}\\s*$', 'ms'),
        ],
        c: [
            new RegExp('int\\s+main\\s*\\([^)]*\\)\\s*{\\s*return\\s+0;\\s*}\\s*$', 'ms'),
        ]
    };
    
    const patterns = boilerplatePatterns[language] || [];
    return patterns.some(pattern => pattern.test(trimmedCode));
}

async function executePiston(code: string, language: string, testCases: TestCase[], problemTitle: string) {
    try {
        // Check if code is just boilerplate
        if (isBoilerplateCode(code, language)) {
            return NextResponse.json({
                results: testCases.map((tc, index) => ({
                    testCaseNumber: index + 1,
                    passed: false,
                    input: tc.input || "",
                    expectedOutput: tc.expectedOutput || "",
                    actualOutput: "",
                    error: "Please write your solution. Boilerplate code cannot pass test cases.",
                    executionTime: 0,
                    memory: 0
                })),
                passedCount: 0,
                totalTests: testCases.length,
                hasErrors: true,
                feedback: {
                    status: "not-started",
                    message: "You need to implement your solution before running tests",
                    percentage: 0,
                    codeLines: 0,
                    strengths: [],
                    suggestions: ["Start by understanding the problem statement", "Break down the problem into smaller steps", "Implement your solution step by step"],
                    optimizations: [],
                    nextSteps: ["Read the problem carefully", "Think about the algorithm", "Write your code", "Test with sample inputs"]
                }
            });
        }

        const pistonLang = PISTON_LANGUAGES[language];
        if (!pistonLang) {
            return NextResponse.json(
                { error: "Unsupported language" },
                { status: 400 }
            );
        }

        // Execute test cases sequentially with delay to avoid rate limiting
        const results = [];
        for (let index = 0; index < testCases.length; index++) {
            const testCase = testCases[index];
            
            try {
                // Add 250ms delay between requests (Piston limit: 1 req per 200ms)
                if (index > 0) {
                    await delay(250);
                }

                const startTime = Date.now();
                
                const response = await fetch(`${PISTON_API_URL}/execute`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            language: pistonLang.language,
                            version: pistonLang.version,
                            files: [{
                                content: code
                            }],
                            stdin: testCase.input,
                            compile_timeout: 10000, 
                            run_timeout: 3000,      
                            compile_memory_limit: -1,
                            run_memory_limit: -1
                        })
                    });

                    const executionTime = (Date.now() - startTime) / 1000;
                    const result = await response.json();

                    console.log(`Test case ${index + 1} result:`, JSON.stringify(result, null, 2));

                    // Use the helper function to process result
                    const testResult = processTestResult(result, testCase, index, executionTime);
                    results.push(testResult);

            } catch (error) {
                console.error(`Error executing test case ${index + 1}:`, error);
                results.push({
                    testCaseNumber: index + 1,
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: "Execution failed",
                    error: "Failed to execute code - API error",
                    executionTime: 0,
                    memory: 0
                });
            }
        }

        const passedCount = results.filter(r => r.passed).length;
        const hasErrors = results.some(r => r.error);
        const percentage = (passedCount / testCases.length) * 100;

        const feedback = await generateDetailedFeedback(
            code,
            language,
            results,
            passedCount,
            testCases.length,
            problemTitle,
            percentage
        );

        return NextResponse.json({
            success: true,
            results,
            passedCount,
            totalTests: testCases.length,
            hasErrors,
            feedback
        });

    } catch (error) {
        console.error("Error in code execution:", error);
        return NextResponse.json(
            { error: "Failed to execute code" },
            { status: 500 }
        );
    }
}

interface TestResult {
    testCaseNumber: number;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    error: string | null;
    executionTime: number;
    memory: number;
}

async function generateDetailedFeedback(
    code: string,
    language: string,
    results: TestResult[],
    passedCount: number,
    totalTests: number,
    problemTitle: string,
    percentage: number
) {
    const codeLines = code.split('\n').filter(line => line.trim().length > 0).length;
    
    let status = "";
    let message = "";
    // eslint-disable-next-line prefer-const
    let suggestions: string[] = [];
    // eslint-disable-next-line prefer-const
    let optimizations: string[] = [];
    // eslint-disable-next-line prefer-const
    let strengths: string[] = [];
    let youtubeVideo: { title: string; videoId: string; url: string } | null = null;
    
    if (passedCount === totalTests) {
        status = "excellent";
        message = `Congratulations! Your solution for "${problemTitle}" passed all ${totalTests} test cases. Excellent work!`;
        strengths.push("Successfully handles all test cases");
        strengths.push("Logic is correct and produces expected outputs");
    } else if (passedCount >= totalTests * 0.7) {
        status = "good";
        message = `Good attempt! Your solution passed ${passedCount} out of ${totalTests} test cases (${percentage.toFixed(0)}%). You're on the right track!`;
        suggestions.push("Review the failed test cases to identify edge cases you might have missed");
        suggestions.push("Check for boundary conditions and special inputs");
    } else if (passedCount >= totalTests * 0.4) {
        status = "needs-improvement";
        message = `Your solution passed ${passedCount} out of ${totalTests} test cases (${percentage.toFixed(0)}%). There's room for improvement.`;
        suggestions.push("Revisit your algorithm and logic flow");
        suggestions.push("Test with smaller inputs manually to understand where it fails");
        suggestions.push("Consider using print/debug statements to trace execution");
    } else {
        status = "poor";
        message = `Your solution only passed ${passedCount} out of ${totalTests} test cases (${percentage.toFixed(0)}%). Let's work on improving it!`;
        suggestions.push("Review the problem statement carefully");
        suggestions.push("Break down the problem into smaller steps");
        suggestions.push("Try solving with a simple approach first, then optimize");
        suggestions.push("Look at the sample inputs and outputs to understand the pattern");
    }

    if (codeLines < 10) {
        strengths.push("Concise implementation");
    } else if (codeLines > 50) {
        suggestions.push("Consider breaking down your code into smaller functions for better readability");
    }

    switch (language) {
        case 'python':
            if (!code.includes('def ')) {
                suggestions.push("Consider using functions to organize your code better");
            }
            if (code.split('\n').some(line => line.length > 100)) {
                suggestions.push("Some lines are too long. Break them into multiple lines for readability");
            }
            optimizations.push("Use list comprehensions where applicable for cleaner code");
            optimizations.push("Consider using built-in functions like map(), filter(), or reduce()");
            break;
        case 'java':
            if (!code.includes('StringBuilder') && code.includes('String')) {
                optimizations.push("For string concatenations in loops, consider using StringBuilder");
            }
            optimizations.push("Ensure proper exception handling");
            break;
        case 'cpp':
            if (!code.includes('vector') && code.includes('[')) {
                optimizations.push("Consider using std::vector instead of arrays for dynamic sizing");
            }
            optimizations.push("Use const references for large objects in function parameters");
            break;
        case 'c':
            optimizations.push("Remember to free allocated memory to prevent memory leaks");
            optimizations.push("Check for buffer overflow conditions");
            break;
    }

    const avgExecutionTime = results.reduce((sum, r) => sum + (r.executionTime || 0), 0) / results.length;
    if (avgExecutionTime < 0.1) {
        strengths.push("Excellent time efficiency");
    } else if (avgExecutionTime > 1.0) {
        optimizations.push("Your solution might have high time complexity. Consider optimizing your algorithm");
        optimizations.push("Look for nested loops that could be reduced");
    }

    const failedTests = results.filter(r => !r.passed);
    if (failedTests.length > 0) {
        if (failedTests.length === 1) {
            suggestions.push(`Focus on test case ${failedTests[0].testCaseNumber} - it might be testing an edge case`);
        } else {
            suggestions.push(`Failed test cases: ${failedTests.map(t => t.testCaseNumber).join(', ')}. Analyze what these cases have in common`);
        }
    }

    optimizations.push("Review time and space complexity of your solution");
    optimizations.push("Consider if there's a more efficient algorithm or data structure");
    optimizations.push("Add comments to explain complex logic for better maintainability");

    if (percentage < 60) {
        try {
            youtubeVideo = await searchYouTubeVideos(problemTitle);
        } catch (error) {
            console.error("Failed to fetch YouTube video:", error);
        }
    }

    return {
        status,
        message,
        percentage,
        codeLines,
        strengths: strengths.length > 0 ? strengths : ["Code compiles and runs successfully"],
        suggestions: suggestions.length > 0 ? suggestions : ["Keep up the good work!"],
        optimizations: optimizations.slice(0, 4), // Top 4 optimizations
        nextSteps: generateNextSteps(status),
        youtubeVideo: youtubeVideo || undefined
    };
}

function generateNextSteps(status: string): string[] {
    switch (status) {
        case 'excellent':
            return [
                "Try optimizing your solution further for better time/space complexity",
                "Explore alternative approaches to solve the same problem",
                "Move on to harder problems to challenge yourself",
                "Help others by reviewing their solutions"
            ];
        case 'good':
            return [
                "Debug the failing test cases to understand edge cases",
                "Review the problem constraints carefully",
                "Test with custom inputs to find patterns in failures",
                "Once fixed, try to optimize your solution"
            ];
        case 'needs-improvement':
            return [
                "Re-read the problem statement and understand requirements",
                "Draw out the logic on paper before coding",
                "Start with a brute force solution, then optimize",
                "Use print statements to debug and trace your logic"
            ];
        default:
            return [
                "Take a break and come back with a fresh perspective",
                "Look at similar solved problems for patterns",
                "Break down the problem into smaller sub-problems",
                "Discuss your approach with peers or mentors"
            ];
    }
}

async function searchYouTubeVideos(query: string): Promise<{ title: string; videoId: string; url: string } | null> {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    
    if (!YOUTUBE_API_KEY) {
        console.warn("YouTube API key not configured");
        return null;
    }

    try {
        const searchQuery = encodeURIComponent(`${query} tutorial programming DSA`);
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&type=video&key=${YOUTUBE_API_KEY}&relevanceLanguage=en&videoDefinition=high`,
            { next: { revalidate: 86400 } }
        );

        if (!response.ok) {
            console.error("YouTube API error:", response.status);
            return null;
        }

        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const video = data.items[0];
            return {
                title: video.snippet.title,
                videoId: video.id.videoId,
                url: `https://www.youtube.com/watch?v=${video.id.videoId}`
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching YouTube video:", error);
        return null;
    }
}