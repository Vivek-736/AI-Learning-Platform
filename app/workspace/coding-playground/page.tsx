"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Code2, Clock, Zap, Target, ChevronRight, Loader2, Trophy, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localFont from "next/font/local";
import { toast } from "sonner";

const nohemi = localFont({
    src: [
        {
            path: "../../../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-nohemi",
});

interface AttemptHistory {
    attemptId: string;
    challengeTitle: string;
    challengeDifficulty: string;
    challengeTopic: string;
    totalScore: number;
    problemsSolved: number;
    timeSpent: number;
    submittedAt: string;
    testType: string;
}

export default function CodingPlaygroundPage() {
    const router = useRouter();
    const { user } = useUser();
    
    const [testType, setTestType] = useState<"full-syllabus" | "individual-topic">("individual-topic");
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [topics, setTopics] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [attempts, setAttempts] = useState<AttemptHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        fetch('/api/coding/generate')
            .then(res => res.json())
            .then(data => {
                setTopics(data.topics || []);
            })
            .catch(error => {
                console.error("Error fetching topics:", error);
            });

        if (user?.primaryEmailAddress?.emailAddress) {
            fetchHistory();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchHistory = async () => {
        if (!user?.primaryEmailAddress?.emailAddress) return;
        
        setLoadingHistory(true);
        try {
            const response = await fetch(`/api/coding/attempts?userEmail=${user.primaryEmailAddress.emailAddress}`);
            if (response.ok) {
                const data = await response.json();
                setAttempts(data.attempts || []);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleStartChallenge = async () => {
        if (testType === "individual-topic" && !topic) {
            toast.error("Please select a DSA topic");
            return;
        }

        if (!user?.primaryEmailAddress?.emailAddress) {
            toast.error("Please sign in to start a challenge");
            return;
        }

        setIsGenerating(true);

        try {
            const generateResponse = await fetch('/api/coding/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: user.primaryEmailAddress.emailAddress,
                    testType,
                    topic: testType === 'individual-topic' ? topic : null,
                    difficulty
                })
            });

            if (!generateResponse.ok) {
                throw new Error("Failed to generate challenge");
            }

            const { challenge } = await generateResponse.json();

            const startResponse = await fetch('/api/coding/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challengeId: challenge.challengeId,
                    userEmail: user.primaryEmailAddress.emailAddress
                })
            });

            if (!startResponse.ok) {
                throw new Error("Failed to start attempt");
            }

            const { attemptId } = await startResponse.json();

            toast.success("Challenge generated! Starting...");
            
            router.push(`/workspace/coding-playground/${challenge.challengeId}?attemptId=${attemptId}`);

        } catch (error) {
            console.error("Error starting challenge:", error);
            toast.error("Failed to start challenge. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400';
            case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400';
            case 'hard': return 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400';
        }
    };

    return (
        <div className={`min-h-screen bg-white dark:bg-gray-950 ${nohemi.variable}`}>
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Code2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                        <h1 className={`text-5xl font-bold text-indigo-600 dark:text-indigo-400 ${nohemi.className}`}>
                            Coding Playground
                        </h1>
                    </div>
                    <p className={`text-gray-600 dark:text-gray-400 text-lg ${nohemi.className}`}>
                        Master DSA with timed coding challenges
                    </p>
                </motion.div>

                <Tabs defaultValue="new-challenge" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                        <TabsTrigger value="new-challenge">New Challenge</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="new-challenge">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Challenge Configuration */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className="border-2 border-indigo-200 dark:border-indigo-800">
                                    <CardContent className="p-6">
                                        <h2 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 ${nohemi.className}`}>
                                            Configure Your Challenge
                                        </h2>

                                        <div className="space-y-6">
                                            {/* Test Type */}
                                            <div>
                                                <label className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${nohemi.className}`}>
                                                    Test Type
                                                </label>
                                                <Select value={testType} onValueChange={(value) => setTestType(value as "full-syllabus" | "individual-topic")}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="individual-topic">Individual Topic</SelectItem>
                                                        <SelectItem value="full-syllabus">Full Syllabus</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {testType === "full-syllabus" 
                                                        ? "Mixed problems from multiple DSA topics"
                                                        : "Focus on a specific DSA topic"
                                                    }
                                                </p>
                                            </div>

                                            {/* Topic Selection (only for individual-topic) */}
                                            {testType === "individual-topic" && (
                                                <div>
                                                    <label className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${nohemi.className}`}>
                                                        DSA Topic
                                                    </label>
                                                    <Select value={topic} onValueChange={setTopic}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a topic" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-64">
                                                            {topics.map((t) => (
                                                                <SelectItem key={t} value={t}>
                                                                    {t}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            {/* Difficulty */}
                                            <div>
                                                <label className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${nohemi.className}`}>
                                                    Difficulty Level
                                                </label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {["easy", "medium", "hard"].map((diff) => (
                                                        <button
                                                            key={diff}
                                                            onClick={() => setDifficulty(diff)}
                                                            className={`
                                                                px-4 py-3 rounded-lg font-semibold transition-all
                                                                ${difficulty === diff
                                                                    ? getDifficultyColor(diff) + " ring-2 ring-offset-2"
                                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                                }
                                                            `}
                                                        >
                                                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Start Button */}
                                            <Button
                                                onClick={handleStartChallenge}
                                                disabled={isGenerating || (testType === "individual-topic" && !topic)}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 cursor-pointer text-lg font-bold"
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Generating Challenge...
                                                    </>
                                                ) : (
                                                    <>
                                                        Start Challenge
                                                        <ChevronRight className="w-5 h-5 ml-2" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Challenge Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6"
                            >
                                <Card className="bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-indigo-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                            <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                                Challenge Format
                                            </h3>
                                        </div>
                                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-5 h-5 text-indigo-500" />
                                                <span>4 Coding Problems</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-indigo-500" />
                                                <span>60 Minutes Total</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-indigo-500" />
                                                <span>Multiple Test Cases</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Trophy className="w-5 h-5 text-indigo-500" />
                                                <span>Professional Feedback</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
                                    <CardContent className="p-3.5">
                                        <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 ${nohemi.className}`}>
                                            💡 Tips for Success
                                        </h3>
                                        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                            <li>• Read all problems before starting</li>
                                            <li>• Start with the easiest problem</li>
                                            <li>• Test your code with edge cases</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 mb-6">
                                <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                <h2 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 ${nohemi.className}`}>
                                    Your Attempt History
                                </h2>
                            </div>

                            {loadingHistory ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                </div>
                            ) : attempts.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            No attempts yet. Start your first challenge!
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {attempts.map((attempt, index) => (
                                        <motion.div
                                            key={attempt.attemptId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card 
                                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                                onClick={() => router.push(`/workspace/coding-playground/results/${attempt.attemptId}`)}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 ${nohemi.className}`}>
                                                                {attempt.challengeTitle}
                                                            </h3>
                                                            <div className="flex items-center gap-3 flex-wrap">
                                                                <Badge className={getDifficultyColor(attempt.challengeDifficulty)}>
                                                                    {attempt.challengeDifficulty}
                                                                </Badge>
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {attempt.challengeTopic || "Full Syllabus"}
                                                                </span>
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {attempt.problemsSolved}/4 solved
                                                                </span>
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {Math.round((attempt.timeSpent || 0) / 60)} min
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-3xl font-bold ${nohemi.className}`}>
                                                                <span className="text-indigo-600 dark:text-indigo-400">
                                                                    {attempt.totalScore}
                                                                </span>
                                                                <span className="text-gray-400 text-xl">/100</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(attempt.submittedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}