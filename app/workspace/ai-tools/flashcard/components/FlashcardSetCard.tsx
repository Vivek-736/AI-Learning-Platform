'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, MessageSquare, BookOpen, PenTool, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FlashcardSet {
    fid: string;
    title: string;
    description: string;
    totalCards: number;
    difficulty: string;
    createdAt: string;
    courseId?: string;
    customTopic?: string;
}

interface FlashcardSetCardProps {
    flashcardSet: FlashcardSet;
    onUpdate: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FlashcardSetCard: React.FC<FlashcardSetCardProps> = ({ flashcardSet, onUpdate }) => {
    const router = useRouter();

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const handleStudy = () => {
        router.push(`/workspace/ai-tools/flashcard/${flashcardSet.fid}/study`);
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 transform dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-1">
                            {flashcardSet.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {flashcardSet.description || 'No description provided'}
                        </CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(flashcardSet.difficulty)}>
                        {flashcardSet.difficulty}
                    </Badge>
                </div>
            </CardHeader>
            
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {flashcardSet.totalCards} Cards
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            ~{Math.ceil(flashcardSet.totalCards * 0.5)} min
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        {flashcardSet.courseId ? (
                            <>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Course-based Cards
                            </>
                        ) : (
                            <>
                                <PenTool className="h-4 w-4 mr-2" />
                                Topic: {flashcardSet.customTopic}
                            </>
                        )}
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-500">
                        Created {new Date(flashcardSet.createdAt).toLocaleDateString()}
                    </div>

                    <Button
                        onClick={handleStudy}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        <Play className="h-4 w-4 mr-2" />
                        Study Cards
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default FlashcardSetCard;
