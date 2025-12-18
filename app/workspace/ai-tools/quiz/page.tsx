'use client';

import React, { useEffect, useState } from 'react';
import { Brain, Plus, History, Trophy, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateQuizDialog from './components/CreateQuizDialog';
import QuizCard from './components/QuizCard';
import QuizHistory from './components/QuizHistory';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

interface Quiz {
    qid: string;
    title: string;
    description: string;
    totalQuestions: number;
    difficulty: string;
    createdAt: string;
    courseId?: string;
    customTopic?: string;
}

interface QuizAttempt {
    attemptId: string;
    score: number;
    percentage: number;
    completedAt: string;
}

const QuizPage = () => {
    const { user } = useUser();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (user) {
            fetchQuizzes();
            fetchRecentAttempts();
        }
    }, [user]);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('/api/quiz');
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentAttempts = async () => {
        try {
            const response = await axios.get('/api/quiz/attempts?recent=true');
            setRecentAttempts(response.data);
        } catch (error) {
            console.error('Error fetching recent attempts:', error);
        }
    };

    const handleQuizCreated = () => {
        fetchQuizzes();
        setShowCreateDialog(false);
    };

    if (loading) {
        return (
            <div className="min-h-[76vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 dark:bg-[#09090b]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">AI Quiz Generator</h1>
                            <p className="text-gray-600 dark:text-gray-400">Test your knowledge with AI-generated quizzes</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowHistory(true)}
                            variant="outline"
                            className="flex items-center gap-2 cursor-pointer dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            <History className="h-4 w-4" />
                            History
                        </Button>
                        <Button
                            onClick={() => setShowCreateDialog(true)}
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4" />
                            Create Quiz
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="dark:bg-gray-900 dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-300">Total Quizzes</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">{quizzes.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-900 dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-300">Recent Attempts</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">{recentAttempts.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-900 dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-300">Average Score</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                {recentAttempts.length > 0 
                                    ? Math.round(recentAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / recentAttempts.length)
                                    : 0
                                }%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Quizzes</h2>
                    {quizzes.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No quizzes yet</h3>
                                <p className="text-gray-500 mb-4">Create your first AI-generated quiz to get started!</p>
                                <Button
                                    onClick={() => setShowCreateDialog(true)}
                                    className="cursor-pointer"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Quiz
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {quizzes.map((quiz) => (
                                <QuizCard key={quiz.qid} quiz={quiz} onQuizUpdate={fetchQuizzes} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CreateQuizDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onQuizCreated={handleQuizCreated}
            />
            
            <QuizHistory
                open={showHistory}
                onOpenChange={setShowHistory}
            />
        </div>
    );
};

export default QuizPage;
