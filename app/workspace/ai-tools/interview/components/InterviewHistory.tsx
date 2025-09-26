'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Trophy, Eye, Mail, Phone, Calendar, Target, TrendingUp, BarChart3 } from 'lucide-react';
import axios from 'axios';

interface InterviewHistoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface InterviewAttempt {
    sessionId: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone?: string;
    templateTitle: string;
    courseName: string;
    difficulty: string;
    overallScore: number;
    skillScores: {
        [key: string]: number;
    };
    duration: number;
    completedAt: string;
    status: string;
}

interface InterviewStats {
    totalAttempts: number;
    completedAttempts: number;
    averageScore: number;
    topPerformer: {
        name: string;
        score: number;
    };
    commonStrengths: string[];
    commonWeaknesses: string[];
}

const InterviewHistory: React.FC<InterviewHistoryProps> = ({ open, onOpenChange }) => {
    const [attempts, setAttempts] = useState<InterviewAttempt[]>([]);
    const [stats, setStats] = useState<InterviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAttempt, setSelectedAttempt] = useState<InterviewAttempt | null>(null);

    useEffect(() => {
        if (open) {
            fetchHistory();
            fetchStats();
        }
    }, [open]);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('/api/interview/feedback');
            setAttempts(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/interview/analytics/overview');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'bg-green-100 text-green-800';
        if (score >= 80) return 'bg-blue-100 text-blue-800';
        if (score >= 70) return 'bg-yellow-100 text-yellow-800';
        if (score >= 60) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Very Good';
        if (score >= 70) return 'Good';
        if (score >= 60) return 'Average';
        return 'Needs Improvement';
    };

    const viewDetails = (attempt: InterviewAttempt) => {
        setSelectedAttempt(attempt);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Interview History & Analytics</DialogTitle>
                    <DialogDescription>
                        View all interview attempts and performance analytics
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="history" className="w-full">
                    <TabsList className="grid w-full grid-cols-1">
                        <TabsTrigger value="history">Interview History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="history" className="space-y-4">
                        <ScrollArea className="h-[60vh]">
                            {loading ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                </div>
                            ) : attempts.length === 0 ? (
                                <div className="text-center py-12">
                                    <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No interviews completed yet</h3>
                                    <p className="text-gray-500">Share your interview links to see attempts here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {attempts.map((attempt) => (
                                        <Card key={attempt.sessionId} className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg flex items-center gap-2">
                                                            {attempt.templateTitle}
                                                            <Badge variant="outline" className="text-xs">
                                                                {attempt.courseName}
                                                            </Badge>
                                                        </CardTitle>
                                                        <CardDescription className="mt-1">
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <div className="flex items-center gap-1">
                                                                    <User className="h-3 w-3" />
                                                                    {attempt.candidateName}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Mail className="h-3 w-3" />
                                                                    {attempt.candidateEmail}
                                                                </div>
                                                                {attempt.candidatePhone && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Phone className="h-3 w-3" />
                                                                        {attempt.candidatePhone}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardDescription>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge className={getScoreColor(attempt.overallScore)}>
                                                            {attempt.overallScore}/100
                                                        </Badge>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {getScoreLabel(attempt.overallScore)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Target className="h-4 w-4" />
                                                            {attempt.difficulty}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(attempt.completedAt).toLocaleDateString()}
                                                        </div>
                                                        <Badge 
                                                            variant={attempt.status === 'completed' ? 'default' : 'secondary'}
                                                            className="text-xs"
                                                        >
                                                            {attempt.status}
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => viewDetails(attempt)}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View Details
                                                    </Button>
                                                </div>
                                                {attempt.skillScores && Object.keys(attempt.skillScores).length > 0 && (
                                                    <div className="mt-4 pt-4 border-t">
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Skill Breakdown:</p>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                            {Object.entries(attempt.skillScores).map(([skill, score]) => (
                                                                <div key={skill} className="text-center">
                                                                    <p className="text-xs text-gray-500 capitalize">
                                                                        {skill.replace(/([A-Z])/g, ' $1').trim()}
                                                                    </p>
                                                                    <p className="font-semibold text-sm">{score}/100</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        {stats ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                                            <Target className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
                                            <p className="text-xs text-muted-foreground">
                                                {stats.completedAttempts} completed
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{Math.round(stats.averageScore)}/100</div>
                                            <p className="text-xs text-muted-foreground">
                                                {getScoreLabel(stats.averageScore)}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                                            <Trophy className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{stats.topPerformer?.score || 0}/100</div>
                                            <p className="text-xs text-muted-foreground">
                                                {stats.topPerformer?.name || 'No attempts yet'}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {stats.totalAttempts > 0 
                                                    ? Math.round((stats.completedAttempts / stats.totalAttempts) * 100)
                                                    : 0
                                                }%
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Success rate
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-green-700">Common Strengths</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {stats.commonStrengths?.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {stats.commonStrengths.map((strength, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                            <span className="text-sm text-gray-700">{strength}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500">No data available yet</p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-orange-700">Common Areas for Improvement</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {stats.commonWeaknesses?.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {stats.commonWeaknesses.map((weakness, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                            <span className="text-sm text-gray-700">{weakness}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500">No data available yet</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {selectedAttempt && (
                    <Dialog open={!!selectedAttempt} onOpenChange={() => setSelectedAttempt(null)}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{selectedAttempt.templateTitle} - Interview Details</DialogTitle>
                                <DialogDescription>
                                    Detailed view of {selectedAttempt.candidateName}&apos;s interview
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Candidate</p>
                                        <p className="text-sm">{selectedAttempt.candidateName}</p>
                                        <p className="text-xs text-gray-500">{selectedAttempt.candidateEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Overall Score</p>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getScoreColor(selectedAttempt.overallScore)}>
                                                {selectedAttempt.overallScore}/100
                                            </Badge>
                                            <span className="text-sm text-gray-600">
                                                {getScoreLabel(selectedAttempt.overallScore)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="font-medium text-gray-700">Duration</p>
                                        <p>{formatTime(selectedAttempt.duration || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Completed</p>
                                        <p>{new Date(selectedAttempt.completedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {selectedAttempt.skillScores && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-3">Skill Breakdown</p>
                                        <div className="space-y-2">
                                            {Object.entries(selectedAttempt.skillScores).map(([skill, score]) => (
                                                <div key={skill} className="flex items-center justify-between">
                                                    <span className="text-sm capitalize">
                                                        {skill.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-blue-600 h-2 rounded-full" 
                                                                style={{ width: `${score}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-semibold w-12">{score}/100</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default InterviewHistory;
