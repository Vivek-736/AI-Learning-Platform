'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trophy, Clock, Target, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface QuizHistoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface QuizAttempt {
    attemptId: string;
    quizId: string;
    quizTitle: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    timeSpent: number;
    completedAt: string;
    difficulty: string;
}

interface QuizStats {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    totalTimeSpent: number;
    quizzesTaken: number;
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ open, onOpenChange }) => {
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [stats, setStats] = useState<QuizStats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            fetchHistory();
        }
    }, [open]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const [attemptsRes, statsRes] = await Promise.all([
                axios.get('/api/quiz/attempts'),
                axios.get('/api/quiz/stats')
            ]);
            
            setAttempts(attemptsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching quiz history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 bg-green-50';
        if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleRetakeQuiz = (quizId: string) => {
        onOpenChange(false);
        router.push(`/workspace/ai-tools/quiz/${quizId}/attempt`);
    };

    const PerformanceChart = () => {
        const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

        if (attempts.length < 2) {
            return (
                <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Take more quizzes to see your performance trend</p>
                    </div>
                </div>
            );
        }

        const sortedAttempts = [...attempts].sort((a, b) => 
            new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
        );

        const firstHalf = sortedAttempts.slice(0, Math.floor(sortedAttempts.length / 2));
        const secondHalf = sortedAttempts.slice(Math.floor(sortedAttempts.length / 2));
        
        const firstHalfAvg = firstHalf.reduce((sum, attempt) => sum + attempt.percentage, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, attempt) => sum + attempt.percentage, 0) / secondHalf.length;
        
        const isImproving = secondHalfAvg > firstHalfAvg;
        const trendPercentage = Math.abs(secondHalfAvg - firstHalfAvg).toFixed(1);

        const getCurvePoints = () => {
            const points = sortedAttempts.map((attempt, index) => {
                const x = (index / (sortedAttempts.length - 1)) * 85 + 10;
                const y = 95 - (attempt.percentage * 0.95);
                return { x, y, percentage: attempt.percentage, date: attempt.completedAt };
            });

            let path = `M${points[0].x},${points[0].y}`;
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i];
                const p1 = points[i + 1];
                const cp1x = p0.x + (p1.x - p0.x) / 2;
                const cp1y = p0.y;
                const cp2x = p0.x + (p1.x - p0.x) / 2;
                const cp2y = p1.y;
                path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
            }
            return path;
        };

        return (
            <TooltipProvider>
                <div className="h-64 relative bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg p-4">
                    <div className="absolute inset-0 p-6">
                        {[0, 25, 50, 75, 100].map((value) => (
                            <div
                                key={value}
                                className="absolute left-4 right-10 border-t border-gray-200/50"
                                style={{ bottom: `${value * 0.95}%` }}
                            >
                                <span className="absolute -left-10 text-[9px] text-gray-400 font-medium">
                                    {value}%
                                </span>
                            </div>
                        ))}

                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor={isImproving ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                                    <stop offset="100%" stopColor={isImproving ? "#10b981" : "#ef4444"} stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            <path
                                d={`${getCurvePoints()} L95,95 L10,95 Z`}
                                fill="url(#chartGradient)"
                                className="animate-[draw_1s_ease-in-out]"
                            />

                            <path
                                d={getCurvePoints()}
                                fill="none"
                                stroke={isImproving ? "#10b981" : "#ef4444"}
                                strokeWidth="2"
                                className="animate-[draw_1s_ease-in-out]"
                            />

                            {sortedAttempts.map((attempt, index) => {
                                const x = (index / (sortedAttempts.length - 1)) * 85 + 10;
                                const y = 95 - (attempt.percentage * 0.95);
                                return (
                                    <Tooltip key={index}>
                                        <TooltipTrigger asChild>
                                            <g onMouseEnter={() => setHoveredPoint(index)} onMouseLeave={() => setHoveredPoint(null)}>
                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r={hoveredPoint === index ? "3" : "2"}
                                                    fill={isImproving ? "#10b981" : "#ef4444"}
                                                    className="transition-all duration-200"
                                                />
                                            </g>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-sm font-medium">{attempt.percentage}%</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </svg>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-8 rounded-full shadow">
                        {isImproving ? (
                            <>
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-medium text-green-600">
                                    +{trendPercentage}% trend
                                </span>
                            </>
                        ) : (
                            <>
                                <TrendingDown className="h-5 w-5 text-red-600" />
                                <span className="text-sm font-medium text-red-600">
                                    -{trendPercentage}% trend
                                </span>
                            </>
                        )}
                    </div>

                    <style jsx>{`
                        @keyframes draw {
                            from {
                                stroke-dashoffset: 1000;
                            }
                            to {
                                stroke-dashoffset: 0;
                            }
                        }
                        path {
                            stroke-dasharray: 1000;
                            stroke-dashoffset: 1000;
                            animation: draw 1s ease-in-out forwards;
                        }
                    `}</style>
                </div>
            </TooltipProvider>
        );
    };

    if (loading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[60vh]">
                    <div className="flex items-center justify-center mt-4">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Quiz History & Statistics</DialogTitle>
                    <DialogDescription className='text-center'>
                        Track your progress and review past quiz attempts
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="history" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="history">Quiz History</TabsTrigger>
                        <TabsTrigger value="stats">Statistics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="history" className="space-y-4">
                        <ScrollArea className="h-[60vh]">
                            {attempts.length === 0 ? (
                                <div className="text-center py-12">
                                    <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No quiz attempts yet</h3>
                                    <p className="text-gray-500">Start taking quizzes to see your history here!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {attempts.map((attempt) => (
                                        <Card key={attempt.attemptId} className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-lg">{attempt.quizTitle}</CardTitle>
                                                        <CardDescription>
                                                            Completed on {new Date(attempt.completedAt).toLocaleDateString()} at{' '}
                                                            {new Date(attempt.completedAt).toLocaleTimeString()}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge className={getScoreColor(attempt.percentage)}>
                                                        {attempt.percentage}%
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <Target className="h-4 w-4 mr-1" />
                                                            {attempt.score}/{attempt.totalQuestions} correct
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            {formatTime(attempt.timeSpent || 0)}
                                                        </div>
                                                        <Badge variant="outline">{attempt.difficulty}</Badge>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRetakeQuiz(attempt.quizId)}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                        Retake
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-6">
                        {stats && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Performance Over Time</CardTitle>
                                        <CardDescription>Your quiz performance trend with growth/decline indicators</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PerformanceChart />
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default QuizHistory;
