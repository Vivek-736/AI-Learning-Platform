'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, CheckCircle, AlertTriangle, Lightbulb, Star, Loader2, Minus, TrendingUp } from 'lucide-react';
import axios from 'axios';
import localFont from "next/font/local";

const nohemi = localFont({
    src: [
        {
            path: "../../../../../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../../../../public/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf",
            weight: "500",
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
        if (score >= 90) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800';
        if (score >= 70) return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800';
        if (score >= 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
        return 'text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 90) return 'Exceptional';
        if (score >= 70) return 'Proficient';
        if (score >= 50) return 'Developing';
        return 'Needs Focus';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Analyzing Performance...</p>
                </div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e]">
                    <CardContent className="pt-8 text-center pb-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Minus className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${nohemi.className}`}>Results Not Found</h3>
                        <p className="text-gray-500 dark:text-gray-400">The results for this interview could not be loaded.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-white dark:bg-black py-12 px-4 ${nohemi.variable}`}>
            <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] dark:opacity-[0.08] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/30 mb-6">
                        <Trophy className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 ${nohemi.className}`}>Performance Review</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mb-1">{results.templateTitle}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Candidate: {results.candidateName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Overall Score Card */}
                    <Card className="md:col-span-1 border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e] shadow-lg">
                        <CardContent className="pt-6 text-center flex flex-col items-center justify-center h-full">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">Overall Score</h3>
                            <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full border-4 mb-6 ${getScoreColor(results.overallScore)}`}>
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl font-bold">{results.overallScore}</span>
                                    <span className="text-xs opacity-80 uppercase mt-1">out of 100</span>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getScoreColor(results.overallScore)} bg-opacity-10`}>
                                {getScoreLabel(results.overallScore)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skill Breakdown */}
                    <Card className="md:col-span-2 border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e] shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className={`flex items-center text-lg text-gray-900 dark:text-white ${nohemi.className}`}>
                                <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
                                Skill proficiency
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            {Object.entries(results.skillScores).map(([skill, score]) => (
                                <div key={skill} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize text-sm">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                            score >= 80 ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/30' : 
                                            score >= 60 ? 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/30' : 
                                            'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/30'
                                        }`}>
                                            {score}%
                                        </span>
                                    </div>
                                    <Progress value={score} className="h-2 bg-gray-100 dark:bg-gray-800" indicatorClassName={
                                        score >= 80 ? 'bg-emerald-500' : 
                                        score >= 60 ? 'bg-amber-500' : 
                                        'bg-rose-500'
                                    } />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card className="border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e] shadow-lg">
                        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                            <CardTitle className={`text-emerald-600 dark:text-emerald-500 flex items-center text-lg ${nohemi.className}`}>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Key Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ul className="space-y-4">
                                {results.detailedFeedback.strengths.map((strength, index) => (
                                    <li key={index} className="flex items-start group">
                                        <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/30 mr-3 mt-0.5 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                                            <Star className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e] shadow-lg">
                        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                            <CardTitle className={`text-amber-600 dark:text-amber-500 flex items-center text-lg ${nohemi.className}`}>
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                Growth Areas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ul className="space-y-4">
                                {results.detailedFeedback.improvements.map((improvement, index) => (
                                    <li key={index} className="flex items-start group">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 group-hover:scale-125 transition-transform"></div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-12 border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e] shadow-lg overflow-hidden">
                    <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                        <CardTitle className={`text-lg text-gray-900 dark:text-white ${nohemi.className}`}>Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 leading-loose text-sm md:text-base">
                                {results.detailedFeedback.overallFeedback}
                            </p>
                        </div>
                        
                        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-6 rounded-xl">
                            <h4 className={`font-semibold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center ${nohemi.className}`}>
                                <Lightbulb className="h-5 w-5 mr-2 text-indigo-500" />
                                Strategic Recommendations
                            </h4>
                            <ul className="space-y-3">
                                {results.detailedFeedback.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start text-indigo-800 dark:text-indigo-200 text-sm">
                                        <span className="mr-2 opacity-60">•</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center pb-12">
                    <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">Session ID: {sessionId}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Completed on {new Date(results.completedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InterviewResultsPage;
