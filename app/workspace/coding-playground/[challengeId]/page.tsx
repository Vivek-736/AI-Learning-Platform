"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2, Send, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import localFont from "next/font/local";

const nohemi = localFont({
    src: [
        {
            path: "../../../../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../../../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../../../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-nohemi",
});

interface Problem {
    problemId: string;
    title: string;
    description: string;
    difficulty: string;
    topic: string;
    constraints?: string;
    inputFormat?: string;
    outputFormat?: string;
    sampleInput?: string;
    sampleOutput?: string;
    explanation?: string;
    hints?: string[];
    testCases?: Array<{ input: string; expectedOutput: string }>;
    order: number;
}

interface Challenge {
    challengeId: string;
    title: string;
    difficulty: string;
    timeLimit: number;
    problems: Problem[];
}

interface TestResult {
    testCaseNumber: number;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    error?: string | null;
    executionTime?: number;
    memory?: number;
}

interface FeedbackData {
    status: string;
    message: string;
    percentage: number;
    codeLines: number;
    strengths: string[];
    suggestions: string[];
    optimizations: string[];
    nextSteps: string[];
    youtubeVideo?: {
        title: string;
        videoId: string;
        url: string;
    };
}

type Language = "java" | "c" | "cpp" | "python";

const BOILERPLATE_CODE: Record<Language, string> = {
    java: `public class Solution {
    public static void main(String[] args) {
        // Your code here
        
    }
}`,
    c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Your code here
    
    return 0;
}`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`,
    python: `def solution():
    # Your code here
    pass

if __name__ == "__main__":
    solution()`
};

export default function ChallengeAttemptPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useUser();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const challengeId = params.challengeId as string;
    const attemptId = searchParams.get('attemptId');

    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [solutions, setSolutions] = useState<Record<string, string>>({});
    const [languages, setLanguages] = useState<Record<string, Language>>({});
    const [timeRemaining, setTimeRemaining] = useState(3600);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [testResults, setTestResults] = useState<Record<string, TestResult[]>>({});
    const [isRunning, setIsRunning] = useState(false);
    const [feedbackData, setFeedbackData] = useState<Record<string, FeedbackData>>({});

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await fetch(`/api/coding/attempts?attemptId=${attemptId}`);
                if (response.ok) {
                    const data = await response.json();
                    setChallenge(data.challenge);
                    
                    const initialSolutions: Record<string, string> = {};
                    const initialLanguages: Record<string, Language> = {};
                    data.challenge.problems.forEach((problem: Problem) => {
                        initialLanguages[problem.problemId] = "python";
                        initialSolutions[problem.problemId] = BOILERPLATE_CODE["python"];
                    });
                    setLanguages(initialLanguages);
                    setSolutions(initialSolutions);
                }
            } catch (error) {
                console.error("Error fetching challenge:", error);
                toast.error("Failed to load challenge");
            } finally {
                setLoading(false);
            }
        };

        if (attemptId) {
            fetchChallenge();
        }
    }, [attemptId]);

    useEffect(() => {
        if (!challenge) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [challenge]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSolutionChange = (problemId: string, code: string) => {
        setSolutions(prev => ({
            ...prev,
            [problemId]: code
        }));
    };

    const handleLanguageChange = (problemId: string, language: Language) => {
        setLanguages(prev => ({
            ...prev,
            [problemId]: language
        }));
        // Update solution with boilerplate if current solution is empty or is boilerplate
        if (!solutions[problemId] || Object.values(BOILERPLATE_CODE).includes(solutions[problemId])) {
            setSolutions(prev => ({
                ...prev,
                [problemId]: BOILERPLATE_CODE[language]
            }));
        }
    };

    const handleResetCode = (problemId: string) => {
        const language = languages[problemId] || "python";
        setSolutions(prev => ({
            ...prev,
            [problemId]: BOILERPLATE_CODE[language]
        }));
        toast.success("Code reset to boilerplate");
    };

    const handleRunTests = async (problemId: string) => {
        if (!challenge) return;

        const problem = challenge.problems.find(p => p.problemId === problemId);
        if (!problem) return;

        const currentCode = solutions[problemId];
        const currentLanguage = languages[problemId] || "python";

        // Check if code is empty or just boilerplate
        if (!currentCode || currentCode.trim() === "" || currentCode === BOILERPLATE_CODE[currentLanguage]) {
            toast.error("Please write some code before running tests!");
            return;
        }

        setIsRunning(true);

        // Clear previous test results for this problem immediately
        setTestResults(prev => {
            const newResults = { ...prev };
            delete newResults[problemId];
            return newResults;
        });

        try {
            toast.info("Executing your code...");

            // Prepare test cases from problem
            const testCases = problem.testCases || [
                {
                    input: problem.sampleInput || "",
                    expectedOutput: problem.sampleOutput || ""
                }
            ];

            // Call the code execution API
            const response = await fetch('/api/coding/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: currentCode,
                    language: currentLanguage,
                    testCases: testCases,
                    problemTitle: problem.title
                })
            });

            if (!response.ok) {
                throw new Error('Failed to execute code');
            }

            const data = await response.json();

            // Set test results for this problem
            setTestResults(prev => ({
                ...prev,
                [problemId]: data.results
            }));

            // Store feedback data for this problem
            if (data.feedback) {
                setFeedbackData(prev => ({
                    ...prev,
                    [problemId]: data.feedback
                }));
            }

            const passedCount = data.passedCount || 0;
            const totalCount = data.totalTests || data.results.length;
            
            if (data.hasErrors) {
                toast.error("❌ Code has errors. Check the results below.");
            } else if (passedCount === totalCount) {
                toast.success(`✅ All ${totalCount} test cases passed!`);
            } else if (passedCount > 0) {
                toast.warning(`⚠️ ${passedCount}/${totalCount} test cases passed`);
            } else {
                toast.error(`❌ 0/${totalCount} test cases passed`);
            }

            // Show detailed feedback if available
            if (data.feedback) {
                setTimeout(() => {
                    toast.info(`Performance: ${data.feedback.status.toUpperCase()} - ${data.feedback.message}`, {
                        duration: 5000
                    });
                }, 1000);

                // Show YouTube video if score is below 60%
                if (data.feedback.youtubeVideo && data.feedback.percentage < 60) {
                    setTimeout(() => {
                        toast.info(
                            <div className="flex flex-col gap-2">
                                <p className="font-semibold">📺 Need Help? Watch This Tutorial</p>
                                <a 
                                    href={data.feedback.youtubeVideo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    {data.feedback.youtubeVideo.title}
                                </a>
                            </div>,
                            {
                                duration: 10000
                            }
                        );
                    }, 2000);
                }
            }
        } catch (error) {
            console.error("Error running tests:", error);
            toast.error("Failed to execute code. Please try again.");
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!challenge || !user?.primaryEmailAddress?.emailAddress) return;

        setIsSubmitting(true);

        try {
            const solutionsArray = challenge.problems.map(problem => ({
                problemId: problem.problemId,
                code: solutions[problem.problemId] || "",
                language: languages[problem.problemId] || "python"
            }));

            const timeSpent = (challenge.timeLimit * 60) - timeRemaining;

            const response = await fetch('/api/coding/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challengeId: challenge.challengeId,
                    userEmail: user.primaryEmailAddress.emailAddress,
                    solutions: solutionsArray,
                    timeSpent
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit");
            }

            const { attempt } = await response.json();
            toast.success("Solutions submitted successfully!");
            
            router.push(`/workspace/coding-playground/results/${attempt.attemptId}`);
        } catch (error) {
            console.error("Error submitting solutions:", error);
            toast.error("Failed to submit solutions");
        } finally {
            setIsSubmitting(false);
        }
    }, [challenge, solutions, languages, timeRemaining, user, router]);

    if (loading) {
        return (
            <div className="min-h-[74vh] flex items-center justify-center bg-white dark:bg-gray-950">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="min-h-[74vh] flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Challenge not found</p>
                </div>
            </div>
        );
    }

    const currentProblem = challenge.problems[currentProblemIndex];

    return (
        <div className={`min-h-screen bg-white dark:bg-gray-950 ${nohemi.variable}`}>
            {/* Timer Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                {challenge.title}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Problem {currentProblemIndex + 1} of {challenge.problems.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                                timeRemaining < 300 
                                    ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                            }`}>
                                <Clock className="w-5 h-5" />
                                <span className={`text-xl font-bold ${nohemi.className}`}>
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit All
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Problem Description */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentProblemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                            {currentProblem.title}
                                        </h2>
                                        <Badge className={
                                            currentProblem.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' :
                                            currentProblem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                                        }>
                                            {currentProblem.difficulty}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Problem Description</h3>
                                            <p className="whitespace-pre-wrap">{currentProblem.description}</p>
                                        </div>

                                        {currentProblem.constraints && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Constraints</h3>
                                                <p className="whitespace-pre-wrap">{currentProblem.constraints}</p>
                                            </div>
                                        )}

                                        {currentProblem.inputFormat && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Input Format</h3>
                                                <p className="whitespace-pre-wrap">{currentProblem.inputFormat}</p>
                                            </div>
                                        )}

                                        {currentProblem.outputFormat && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Output Format</h3>
                                                <p className="whitespace-pre-wrap">{currentProblem.outputFormat}</p>
                                            </div>
                                        )}

                                        {currentProblem.sampleInput && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Sample Input</h3>
                                                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                                                    {currentProblem.sampleInput}
                                                </pre>
                                            </div>
                                        )}

                                        {currentProblem.sampleOutput && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Sample Output</h3>
                                                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                                                    {currentProblem.sampleOutput}
                                                </pre>
                                            </div>
                                        )}

                                        {currentProblem.explanation && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Explanation</h3>
                                                <p className="whitespace-pre-wrap">{currentProblem.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </AnimatePresence>

                    {/* Code Editor */}
                    <div className="space-y-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                        Your Solution
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Select 
                                            value={languages[currentProblem.problemId] || "python"}
                                            onValueChange={(value) => handleLanguageChange(currentProblem.problemId, value as Language)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="python">Python</SelectItem>
                                                <SelectItem value="java">Java</SelectItem>
                                                <SelectItem value="cpp">C++</SelectItem>
                                                <SelectItem value="c">C</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleResetCode(currentProblem.problemId)}
                                        >
                                            <RotateCcw className="w-4 h-4 mr-1" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>

                                <Textarea
                                    value={solutions[currentProblem.problemId] || ""}
                                    onChange={(e) => handleSolutionChange(currentProblem.problemId, e.target.value)}
                                    placeholder="// Write your code here..."
                                    className="min-h-[400px] font-mono text-sm bg-gray-50 dark:bg-gray-900"
                                    spellCheck={false}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                />

                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        💡 Run tests to check your solution
                                    </p>
                                    <Button
                                        onClick={() => handleRunTests(currentProblem.problemId)}
                                        disabled={isRunning}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {isRunning ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Running...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Run Tests
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {testResults[currentProblem.problemId] && (
                            <>
                                <Card>
                                    <CardContent className="p-6">
                                        <h4 className={`text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 ${nohemi.className}`}>
                                            Test Results
                                        </h4>
                                        <div className="space-y-3">
                                            {testResults[currentProblem.problemId].map((result, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-3 rounded-lg border ${
                                                        result.passed
                                                            ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
                                                            : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`font-semibold ${nohemi.className}`}>
                                                            Test Case {result.testCaseNumber}
                                                        </span>
                                                        {result.passed ? (
                                                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                        )}
                                                    </div>
                                                    <div className="text-sm space-y-1">
                                                        <div>
                                                            <span className="font-semibold">Input:</span>
                                                            <pre className="bg-white dark:bg-gray-900 p-2 rounded mt-1 text-xs overflow-x-auto">
                                                                {result.input}
                                                            </pre>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">Expected:</span>
                                                            <pre className="bg-white dark:bg-gray-900 p-2 rounded mt-1 text-xs overflow-x-auto">
                                                                {result.expectedOutput}
                                                            </pre>
                                                        </div>
                                                        {!result.passed && (
                                                            <div>
                                                                <span className="font-semibold text-red-600 dark:text-red-400">Your Output:</span>
                                                                <pre className="bg-white dark:bg-gray-900 p-2 rounded mt-1 text-xs overflow-x-auto">
                                                                    {result.actualOutput}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {result.error && (
                                                            <div>
                                                                <span className="font-semibold text-orange-600 dark:text-orange-400">Error:</span>
                                                                <pre className="bg-orange-50 dark:bg-orange-950/20 p-2 rounded mt-1 text-xs overflow-x-auto text-orange-800 dark:text-orange-300">
                                                                    {result.error}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {(result.executionTime !== undefined || result.memory !== undefined) && (
                                                            <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400 pt-2">
                                                                {result.executionTime !== undefined && (
                                                                    <span>⏱️ {result.executionTime.toFixed(3)}s</span>
                                                                )}
                                                                {result.memory !== undefined && (
                                                                    <span>💾 {(result.memory / 1024).toFixed(2)} MB</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* YouTube Video Recommendation Section */}
                                {feedbackData[currentProblem.problemId]?.youtubeVideo && 
                                 feedbackData[currentProblem.problemId]?.percentage < 60 && (
                                    <Card className="border-2 border-blue-500">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-3 mb-4">
                                                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                                                    <span className="text-2xl">📺</span>
                                                </div>
                                                <div>
                                                    <h4 className={`text-lg font-bold text-blue-900 dark:text-blue-100 ${nohemi.className}`}>
                                                        Need Help? Watch This Tutorial
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        Score: {feedbackData[currentProblem.problemId].percentage.toFixed(0)}% - Here&apos;s a recommended video to help you improve
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-3">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${feedbackData[currentProblem.problemId]?.youtubeVideo?.videoId}`}
                                                    title={feedbackData[currentProblem.problemId]?.youtubeVideo?.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {feedbackData[currentProblem.problemId]?.youtubeVideo?.title}
                                                </p>
                                                <a 
                                                    href={feedbackData[currentProblem.problemId]?.youtubeVideo?.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center gap-1"
                                                >
                                                    Watch on YouTube
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <Button
                        onClick={() => setCurrentProblemIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentProblemIndex === 0}
                        variant="outline"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    <div className="flex gap-2">
                        {challenge.problems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentProblemIndex(index)}
                                className={`w-10 h-10 rounded-full font-bold ${
                                    index === currentProblemIndex
                                        ? 'bg-indigo-600 text-white'
                                        : solutions[challenge.problems[index].problemId]
                                        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={() => setCurrentProblemIndex(prev => Math.min(challenge.problems.length - 1, prev + 1))}
                        disabled={currentProblemIndex === challenge.problems.length - 1}
                        variant="outline"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}