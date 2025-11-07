'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, CheckCircle, AlertTriangle, Lightbulb, Star } from 'lucide-react';
import axios from 'axios';

interface InterviewResults {
    sessionId: string;
    candidateName: string;
    candidateEmail: string;
    templateTitle: string;
    courseName: string;
    difficulty: string;
    duration: number;
    overallScore: number;
    skillScores: {
        [key: string]: number;
    };
    detailedFeedback: {
        strengths: string[];
        improvements: string[];
        recommendations: string[];
        overallFeedback: string;
    };
    completedAt: string;
}

const InterviewResultsPage = () => {
    const params = useParams();
    const { sessionId } = params;
    
    const [results, setResults] = useState<InterviewResults | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    const fetchResults = async () => {
        try {
            const response = await axios.get(`/api/interview/sessions/${sessionId}/results`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-50';
        if (score >= 70) return 'text-blue-600 bg-blue-50';
        if (score >= 50) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 90) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Average';
        return 'Needs Improvement';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <p className="text-gray-600">Results not available yet. Please check back later.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Interview Complete!</h1>
                    <p className="text-gray-600">{results.templateTitle}</p>
                    <p className="text-sm text-gray-500">Candidate: {results.candidateName}</p>
                </div>

                <Card className="mb-8">
                    <CardContent className="pt-6 text-center">
                        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${getScoreColor(results.overallScore)}`}>
                            <div className="text-4xl font-bold">{results.overallScore}</div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{getScoreLabel(results.overallScore)}</h3>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Skill Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(results.skillScores).map(([skill, score]) => (
                            <div key={skill} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <Badge className={score >= 80 ? 'bg-green-100 text-green-800' : score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                                        {score}/100
                                    </Badge>
                                </div>
                                <Progress value={score} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-700 flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {results.detailedFeedback.strengths.map((strength, index) => (
                                    <li key={index} className="flex items-start">
                                        <Star className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-orange-700 flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                Areas for Improvement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {results.detailedFeedback.improvements.map((improvement, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span className="text-gray-700">{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Detailed Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            {results.detailedFeedback.overallFeedback}
                        </p>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Recommendations for Growth
                            </h4>
                            <ul className="space-y-1">
                                {results.detailedFeedback.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm text-blue-700">• {rec}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-gray-500">
                    <p>Interview completed on {new Date(results.completedAt).toLocaleDateString()}</p>
                    <p className="mt-2">Thank you for taking the time to complete this interview!</p>
                </div>
            </div>
        </div>
    );
};

export default InterviewResultsPage;
