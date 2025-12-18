'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mic, Clock, User, Mail, Phone, AlertCircle, CheckCircle, Sparkles, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import Image from 'next/image';
import localFont from "next/font/local";

const nohemi = localFont({
    src: [
        {
            path: "../../../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../../public/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf",
            weight: "500",
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

interface InterviewInfo {
    linkId: string;
    templateId: string;
    title: string;
    instructions: string;
    templateTitle: string;
    courseName: string;
    difficulty: string;
    estimatedDuration: number;
    isActive: boolean;
    expiresAt?: string;
}

const PublicInterviewEntryPage = () => {
    const params = useParams();
    const router = useRouter();
    const linkId = params.linkId as string;

    const [interview, setInterview] = useState<InterviewInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        candidateName: '',
        candidateEmail: '',
        candidatePhone: ''
    });

    useEffect(() => {
        fetchInterviewInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linkId]);

    const fetchInterviewInfo = async () => {
        try {
            const response = await axios.get(`/api/interview/${linkId}`);
            setInterview(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error fetching interview:', error);
            if (error.response?.status === 404) {
                toast.error('Interview not found or has been deactivated');
            } else if (error.response?.status === 410) {
                toast.error('Interview link has expired');
            } else {
                toast.error('Failed to load interview');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.post('/api/interview/sessions', {
                linkId,
                candidateName: formData.candidateName,
                candidateEmail: formData.candidateEmail,
                candidatePhone: formData.candidatePhone
            });

            toast.success('Registration successful! Starting interview...');
            router.push(`/interview/${linkId}/session/${response.data.sessionId}`);
        } catch (error) {
            console.error('Error creating session:', error);
            toast.error('Failed to start interview. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading Interview...</p>
                </div>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e]">
                    <CardContent className="pt-8 text-center pb-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${nohemi.className}`}>Interview Not Available</h3>
                        <p className="text-gray-500 dark:text-gray-400">This interview link is invalid, expired, or has been deactivated.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-white dark:bg-black py-12 px-4 ${nohemi.variable}`}>
            <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] dark:opacity-[0.08] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 mb-6 group hover:scale-105 transition-transform duration-300">
                        <Image 
                            src={'/favicon.png'}
                            alt='favicon'
                            width={48}
                            height={48}
                            className='rounded-xl'
                        />
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight ${nohemi.className}`}>
                        {interview.title}
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <Badge variant="secondary" className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800">
                            {interview.templateTitle}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <Card className="h-fit border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e] shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800/50">
                            <CardTitle className={`flex items-center text-xl text-gray-900 dark:text-white ${nohemi.className}`}>
                                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                                Interview Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 group hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Course</div>
                                    <Badge variant="outline" className="text-center font-medium border-gray-300 dark:border-gray-700 dark:text-gray-300">
                                        {interview.courseName}
                                    </Badge>
                                </div>
                                
                                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 group hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Difficulty</div>
                                    <Badge className={
                                        interview.difficulty === 'easy' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-transparent' :
                                        interview.difficulty === 'medium' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-transparent' :
                                        'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-transparent'
                                    }>
                                        {interview.difficulty.charAt(0).toUpperCase() + interview.difficulty.slice(1)}
                                    </Badge>
                                </div>

                                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 group hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Duration</div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <Clock className="h-4 w-4 mr-1.5 opacity-70" />
                                        <span className="font-semibold">{interview.estimatedDuration} min</span>
                                    </div>
                                </div>
                            </div>

                            {interview.instructions && (
                                <div className="p-6 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl">
                                    <h4 className={`font-semibold text-indigo-900 dark:text-indigo-300 mb-3 text-lg flex items-center ${nohemi.className}`}>
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Instructions
                                    </h4>
                                    <p className="text-indigo-800/80 dark:text-indigo-200/70 leading-relaxed text-sm">{interview.instructions}</p>
                                </div>
                            )}

                            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl">
                                <h4 className={`font-semibold text-gray-900 dark:text-gray-200 mb-4 text-lg flex items-center ${nohemi.className}`}>
                                    <AlertTriangle className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                                    Prerequisites
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                                    {[
                                        "Stable internet connection",
                                        "Quiet environment",
                                        "Microphone access allowed",
                                        "Speak clearly and naturally"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full flex-shrink-0"></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="h-fit border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e] shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                        
                        <CardHeader className="pb-6">
                            <CardTitle className={`text-2xl text-center text-gray-900 dark:text-white ${nohemi.className}`}>Start Session</CardTitle>
                            <p className="text-gray-500 dark:text-gray-400 text-center">Enter your details to begin the AI interview</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name <span className="text-indigo-500">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.candidateName}
                                            onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                                            placeholder="Enter your full name"
                                            className="pl-10 h-12 bg-white dark:bg-black border-2 border-gray-100 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email Address <span className="text-indigo-500">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.candidateEmail}
                                            onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})}
                                            placeholder="your.email@example.com"
                                            className="pl-10 h-12 bg-white dark:bg-black border-2 border-gray-100 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Phone Number <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                                    </Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.candidatePhone}
                                            onChange={(e) => setFormData({...formData, candidatePhone: e.target.value})}
                                            placeholder="+1 (555) 123-4567"
                                            className="pl-10 h-12 bg-white dark:bg-black border-2 border-gray-100 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={submitting || !formData.candidateName || !formData.candidateEmail}
                                        className="w-full h-14 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer duration-300 shadow-lg hover:shadow-indigo-500/30 rounded-xl"
                                    >
                                        {submitting ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                                                Starting Interview...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Mic className="h-5 w-5 mr-3" />
                                                Start Voice Interview
                                            </div>
                                        )}
                                    </Button>
                                    <p className="text-center text-xs text-gray-400 mt-4">
                                        By starting, you agree to have your audio recorded for AI analysis.
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PublicInterviewEntryPage;
