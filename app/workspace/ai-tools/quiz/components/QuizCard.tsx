'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Target, BookOpen, PenTool } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface QuizCardProps {
    quiz: Quiz;
    onQuizUpdate: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QuizCard: React.FC<QuizCardProps> = ({ quiz, onQuizUpdate }) => {
    const router = useRouter();

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStartQuiz = () => {
        router.push(`/workspace/ai-tools/quiz/${quiz.qid}/attempt`);
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 transform">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {quiz.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm text-gray-600 line-clamp-1">
                            {quiz.description || 'No description provided'}
                        </CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                    </Badge>
                </div>
            </CardHeader>
            
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {quiz.totalQuestions} Questions
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            ~{Math.ceil(quiz.totalQuestions * 1.5)} min
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        {quiz.courseId ? (
                            <>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Course-based Quiz
                            </>
                        ) : (
                            <>
                                <PenTool className="h-4 w-4 mr-2" />
                                Topic: {quiz.customTopic}
                            </>
                        )}
                    </div>

                    <div className="text-xs text-gray-500">
                        Created {new Date(quiz.createdAt).toLocaleDateString()}
                    </div>

                    <Button
                        onClick={handleStartQuiz}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 cursor-pointer transition-opacity"
                    >
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizCard;
