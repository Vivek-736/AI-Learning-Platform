'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mic, Clock, User, Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import Image from 'next/image';

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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Interview Not Available</h3>
                        <p className="text-gray-600">This interview link is invalid, expired, or has been deactivated.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <div className="rounded-full flex items-center justify-center mb-2">
                        <Image 
                            src={'/favicon.png'}
                            alt='favicon'
                            width={62}
                            height={62}
                            className='border-2 p-2 rounded-full border-indigo-400'
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{interview.title}</h1>
                    <p className="text-lg text-gray-600">{interview.templateTitle}</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center text-xl">
                                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                                Interview Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Course</div>
                                    <Badge variant="outline" className="text-center">
                                        {interview.courseName}
                                    </Badge>
                                </div>
                                
                                <div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Difficulty</div>
                                    <Badge className={
                                        interview.difficulty === 'easy' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                        interview.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                                        'bg-red-100 text-red-800 hover:bg-red-200'
                                    }>
                                        {interview.difficulty.charAt(0).toUpperCase() + interview.difficulty.slice(1)}
                                    </Badge>
                                </div>

                                <div className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Duration</div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-sm font-medium">{interview.estimatedDuration} min</span>
                                    </div>
                                </div>
                            </div>

                            {interview.instructions && (
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                                    <h4 className="font-semibold text-blue-800 mb-3 text-lg flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Instructions
                                    </h4>
                                    <p className="text-blue-700 leading-relaxed">{interview.instructions}</p>
                                </div>
                            )}

                            <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl">
                                <h4 className="font-semibold text-orange-800 mb-4 text-lg flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    Before You Start
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-orange-700">Ensure stable internet connection</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-orange-700">Use a quiet environment</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-orange-700">Allow microphone access</span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-orange-700">Speak clearly and naturally</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="text-xl text-center">Start Interview</CardTitle>
                            <p className="text-gray-600 text-center">Please provide your details to begin the voice interview</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.candidateName}
                                            onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                                            placeholder="Enter your full name"
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.candidateEmail}
                                            onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})}
                                            placeholder="your.email@example.com"
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium">
                                        Phone Number <span className="text-gray-400">(Optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.candidatePhone}
                                            onChange={(e) => setFormData({...formData, candidatePhone: e.target.value})}
                                            placeholder="+1 (555) 123-4567"
                                            className="pl-10 h-12"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={submitting || !formData.candidateName || !formData.candidateEmail}
                                        className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all cursor-pointer duration-200 shadow-lg hover:shadow-xl"
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
