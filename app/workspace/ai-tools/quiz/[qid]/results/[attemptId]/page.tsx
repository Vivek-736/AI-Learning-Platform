'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, XCircle, ChevronDown, RotateCcw, Home } from 'lucide-react';
import axios from 'axios';

interface QuizResult {
    attemptId: string;
    quizTitle: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    timeSpent: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    questions: any[];
    userAnswers: { [key: number]: number };
}

const QuizResultsPage = () => {
    const params = useParams();
    const router = useRouter();
    const { qid, attemptId } = params;
    const [result, setResult] = useState<QuizResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attemptId]);

    const fetchResults = async () => {
        try {
            const response = await axios.get(`/api/quiz/results/${attemptId}`);
            setResult(response.data);
        } catch (error) {
            console.error('Error fetching results:', error);
            router.push('/workspace/ai-tools/quiz');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 70) return 'text-blue-600';
        return 'text-red-600';
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading) {
        return (
            <div className="min-h-[74vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <p className="text-gray-600 mb-4">Results not found</p>
                        <Button onClick={() => router.push('/workspace/ai-tools/quiz')}>
                            Back to Quizzes
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
                <p className="text-gray-600">{result.quizTitle}</p>
            </div>

            <Card className="mb-8">
                <CardContent className="pt-6 text-center">
                    <div className={`text-6xl font-bold mb-4 ${getScoreColor(result.percentage)}`}>
                        {result.percentage}%
                    </div>
                    <p className="text-xl mb-4">
                        {result.score} out of {result.totalQuestions} correct
                    </p>
                    <p className="text-gray-600">
                        Completed in {formatTime(result.timeSpent)}
                    </p>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Question Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result.questions?.map((question, index) => {
                        const userAnswer = result.userAnswers[index];
                        const isCorrect = userAnswer === question.correctAnswer;
                        
                        return (
                            <Collapsible key={index}>
                                <CollapsibleTrigger asChild>
                                    <div className="flex items-center justify-between p-4 border rounded cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            {isCorrect ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            )}
                                            <div>
                                                <p className="font-medium">Question {index + 1}</p>
                                                <p className="text-sm text-gray-600 truncate max-w-md">
                                                    {question.question}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="p-4 border-t bg-gray-50">
                                        <h4 className="font-medium mb-3">{question.question}</h4>
                                        <div className="space-y-2 mb-4">
                                            {question.options?.map((option: string, optIndex: number) => {
                                                const isUserAnswer = userAnswer === optIndex;
                                                const isCorrectOption = question.correctAnswer === optIndex;
                                                
                                                return (
                                                    <div
                                                        key={optIndex}
                                                        className={`p-2 rounded border ${
                                                            isCorrectOption 
                                                                ? 'bg-green-100 border-green-300'
                                                                : isUserAnswer 
                                                                    ? 'bg-red-100 border-red-300'
                                                                    : 'bg-white border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{option}</span>
                                                            <div className="flex space-x-2">
                                                                {isUserAnswer && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        Your Answer
                                                                    </Badge>
                                                                )}
                                                                {isCorrectOption && (
                                                                    <Badge className="text-xs bg-green-600">
                                                                        Correct
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {question.explanation && (
                                            <div className="p-3 bg-blue-50 border rounded">
                                                <p className="text-sm">
                                                    <strong>Explanation:</strong> {question.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}
                </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
                <Button
                    onClick={() => router.push(`/workspace/ai-tools/quiz/${qid}/attempt`)}
                    variant="outline"
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz
                </Button>
                <Button onClick={() => router.push('/workspace/ai-tools/quiz')}>
                    <Home className="h-4 w-4 mr-2" />
                    Back to Quizzes
                </Button>
            </div>
        </div>
    );
};

export default QuizResultsPage;
