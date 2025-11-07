"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Clock, Target, TrendingUp, CheckCircle2, XCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import localFont from "next/font/local";

const nohemi = localFont({
    src: [
        {
            path: "../../../../../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../../../../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../../../../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-nohemi",
});

interface Feedback {
    performanceLevel: string;
    overallComment: string;
    score: number;
    maxScore: number;
    percentage: number;
    problemsAttempted: number;
    problemsSolved: number;
    totalProblems: number;
    testCasesPassed: number;
    testCasesFailed: number;
    totalTestCases: number;
    timeSpent: number;
    timeLimit: number;
    difficulty: string;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
}

interface ProblemFeedback {
    status: string;
    message: string;
    percentage: number;
    codeLines: number;
    strengths: string[];
    suggestions: string[];
    optimizations: string[];
    nextSteps: string[];
}

interface Solution {
    problemId: string;
    code: string;
    language: string;
    score: number;
    passedTestCases: number;
    totalTestCases: number;
    feedback?: ProblemFeedback;
}

interface AttemptData {
    attemptId: string;
    totalScore: number;
    problemsAttempted: number;
    problemsSolved: number;
    testCasesPassed: number;
    testCasesFailed: number;
    timeSpent: number;
    feedback: Feedback;
    solutions?: Solution[];
}

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const attemptId = params.attemptId as string;

    const [attempt, setAttempt] = useState<AttemptData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/coding/attempts?attemptId=${attemptId}`);
                if (response.ok) {
                    const data = await response.json();
                    setAttempt(data.attempt);
                }
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };

        if (attemptId) {
            fetchResults();
        }
    }, [attemptId]);

    if (loading) {
        return (
            <div className="min-h-[74vh] flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="animate-pulse text-indigo-600 dark:text-indigo-400">Loading results...</div>
            </div>
        );
    }

    if (!attempt || !attempt.feedback) {
        return (
            <div className="min-h-[74vh] flex items-center justify-center bg-white dark:bg-gray-950">
                <p className="text-gray-600 dark:text-gray-400">Results not found</p>
            </div>
        );
    }

    const feedback = attempt.feedback;
    const scorePercentage = feedback.percentage;

    const getPerformanceColor = () => {
        if (scorePercentage >= 90) return "text-green-600 dark:text-green-400";
        if (scorePercentage >= 75) return "text-blue-600 dark:text-blue-400";
        if (scorePercentage >= 60) return "text-yellow-600 dark:text-yellow-400";
        if (scorePercentage >= 40) return "text-orange-600 dark:text-orange-400";
        return "text-red-600 dark:text-red-400";
    };

    return (
        <div className={`min-h-screen bg-white dark:bg-gray-950 ${nohemi.variable}`}>
            <div className="max-w-6xl mx-auto p-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Trophy className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                        <h1 className={`text-5xl font-bold text-indigo-600 dark:text-indigo-400 ${nohemi.className}`}>
                            Challenge Results
                        </h1>
                    </div>
                    <p className={`text-gray-600 dark:text-gray-400 text-lg ${nohemi.className}`}>
                        Here&apos;s how you performed
                    </p>
                </motion.div>

                {/* Score Overview */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mb-12"
                >
                    <Card className="border-2 border-indigo-200 dark:border-indigo-800">
                        <CardContent className="p-8 text-center">
                            <div className={`text-8xl font-bold mb-4 ${getPerformanceColor()} ${nohemi.className}`}>
                                {feedback.score}
                                <span className="text-4xl text-gray-400">/100</span>
                            </div>
                            <div className="mb-6">
                                <Badge className="text-lg px-6 py-2 bg-indigo-600 text-white">
                                    {feedback.performanceLevel}
                                </Badge>
                            </div>
                            <p className={`text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto ${nohemi.className}`}>
                                {feedback.overallComment}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Statistics Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    <h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                        Problems Solved
                                    </h3>
                                </div>
                                <div className={`text-4xl font-bold text-blue-600 dark:text-blue-400 ${nohemi.className}`}>
                                    {feedback.problemsSolved}/{feedback.totalProblems}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    {feedback.problemsAttempted} attempted
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    <h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                        Test Cases
                                    </h3>
                                </div>
                                <div className={`text-4xl font-bold text-green-600 dark:text-green-400 ${nohemi.className}`}>
                                    {feedback.testCasesPassed}/{feedback.totalTestCases}
                                </div>
                                <Progress 
                                    value={(feedback.testCasesPassed / feedback.totalTestCases) * 100} 
                                    className="mt-4"
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                        Time Taken
                                    </h3>
                                </div>
                                <div className={`text-4xl font-bold text-indigo-600 dark:text-indigo-400 ${nohemi.className}`}>
                                    {feedback.timeSpent} min
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    out of {feedback.timeLimit} min
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="border-green-200 dark:border-green-800 h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                        Strengths
                                    </h3>
                                </div>
                                <ul className="space-y-3">
                                    {feedback.strengths.map((strength, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Card className="border-orange-200 dark:border-orange-800 h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <XCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                        Areas for Improvement
                                    </h3>
                                </div>
                                <ul className="space-y-3">
                                    {feedback.areasForImprovement.map((area, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <XCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{area}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Per-Problem Detailed Feedback */}
                {attempt.solutions && attempt.solutions.some(s => s.feedback) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mb-12"
                    >
                        <h2 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 ${nohemi.className}`}>
                            💡 Detailed Problem Analysis
                        </h2>
                        <div className="space-y-6">
                            {attempt.solutions.map((solution, index) => solution.feedback && (
                                <Card key={solution.problemId} className="border-2 border-gray-200 dark:border-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                                    Problem {index + 1}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <Badge variant={solution.feedback.status === "excellent" ? "default" : "secondary"}>
                                                        {solution.feedback.status.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {solution.passedTestCases}/{solution.totalTestCases} test cases passed
                                                    </span>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {solution.feedback.codeLines} lines • {solution.language}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`text-3xl font-bold ${nohemi.className}`}>
                                                {solution.score}/25
                                            </div>
                                        </div>

                                        <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                                            {solution.feedback.message}
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            {/* Strengths */}
                                            {solution.feedback.strengths.length > 0 && (
                                                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                                                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Strengths
                                                    </h4>
                                                    <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
                                                        {solution.feedback.strengths.map((strength, i) => (
                                                            <li key={i}>• {strength}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Suggestions */}
                                            {solution.feedback.suggestions.length > 0 && (
                                                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                                                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                                                        <XCircle className="w-4 h-4" />
                                                        Suggestions
                                                    </h4>
                                                    <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-400">
                                                        {solution.feedback.suggestions.map((suggestion, i) => (
                                                            <li key={i}>• {suggestion}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Optimizations */}
                                        {solution.feedback.optimizations.length > 0 && (
                                            <div className="mt-4 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                                                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                                                    🚀 Optimization Tips
                                                </h4>
                                                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                                                    {solution.feedback.optimizations.map((opt, i) => (
                                                        <li key={i}>• {opt}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Next Steps */}
                                        {solution.feedback.nextSteps.length > 0 && (
                                            <div className="mt-4 bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-lg">
                                                <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                                                    📖 Next Steps
                                                </h4>
                                                <ul className="space-y-1 text-sm text-indigo-700 dark:text-indigo-400">
                                                    {solution.feedback.nextSteps.map((step, i) => (
                                                        <li key={i}>{i + 1}. {step}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mb-12"
                >
                    <Card className="bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-indigo-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800">
                        <CardContent className="p-6">
                            <h3 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${nohemi.className}`}>
                                📚 Overall Recommendations
                            </h3>
                            <ul className="space-y-2">
                                {feedback.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{index + 1}.</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="flex items-center justify-center gap-4"
                >
                    <Button
                        onClick={() => router.push('/workspace/coding-playground')}
                        variant="outline"
                        className="px-8 py-6 text-lg"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Playground
                    </Button>
                    <Button
                        onClick={() => router.push('/workspace')}
                        className="px-8 py-6 text-lg bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go to Dashboard
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}