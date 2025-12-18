'use client';

import React, { useEffect, useState } from 'react';
import { Mic, History, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateInterviewDialog from './components/CreateInterviewDialog';
import InterviewHistory from './components/InterviewHistory';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import localFont from "next/font/local";

const nohemi = localFont({
    src: [
        {
            path: "../../../../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../../../public/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../../../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../../../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-nohemi",
});

interface InterviewTemplate {
    templateId: string;
    title: string;
    description: string;
    courseId: string;
    courseName: string;
    difficulty: string;
    estimatedDuration: number;
    isActive: boolean;
    createdAt: string;
    totalAttempts?: number;
    averageScore?: number;
}

interface InterviewLink {
    linkId: string;
    templateId: string;
    title: string;
    createdAt: string;
    isActive: boolean;
}

const InterviewPage = () => {
    const { user } = useUser();
    const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
    const [links, setLinks] = useState<InterviewLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (user) {
            fetchTemplates();
            fetchLinks();
        }
    }, [user]);

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('/api/interview/templates');
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLinks = async () => {
        try {
            const response = await axios.get('/api/interview/links');
            setLinks(response.data);
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    const handleCreateTemplate = () => {
        fetchTemplates();
        setShowCreateDialog(false);
    };

    const createShareableLink = async (templateId: string, title: string) => {
        try {
            const response = await axios.post('/api/interview/links', {
                templateId,
                title: `${title} - Interview`,
                instructions: 'Please complete this interview honestly and speak clearly.'
            });
            
            const shareUrl = `${window.location.origin}/interview/${response.data.linkId}`;
            navigator.clipboard.writeText(shareUrl);
            toast.success('Interview link copied to clipboard!');
            fetchLinks();
        } catch (error) {
            console.error('Error creating link:', error);
            toast.error('Failed to create interview link');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[76vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-white dark:bg-[#09090b] ${nohemi.variable}`}>
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-gray-200 rounded-lg dark:border-gray-900">
                <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-950/10 rounded-lg pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
                                    <Sparkles className="w-4 h-4" />
                                    <span>AI-Powered Interviews</span>
                                </div>
                                <h1 className={`text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight ${nohemi.className}`}>
                                    Master Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Voice Presence</span>
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg mt-4 leading-relaxed">
                                    Create and manage course-based interview templates with real-time AI feedback and scoring.
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                                <Button 
                                    onClick={() => setShowCreateDialog(true)} 
                                    className="bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-800 dark:bg-indigo-500 text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                                >
                                    Create New Interview
                                </Button>
                                <Button 
                                    onClick={() => setShowHistory(true)} 
                                    variant="outline" 
                                    className="px-8 py-6 rounded-xl text-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-white cursor-pointer"
                                >
                                    <History className="h-5 w-5 mr-2" />
                                    View History
                                </Button>
                            </div>
                        </div>

                        <div className="relative lg:h-[500px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                            <img 
                                src="/interview_hero.png" 
                                alt="AI Interview" 
                                className="relative z-10 w-full max-w-md lg:max-w-full drop-shadow-2xl rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { title: "Templates Created", value: templates.length, icon: Mic, color: "text-blue-600" },
                        { title: "Active Links", value: links.filter(l => l.isActive).length, icon: ExternalLink, color: "text-purple-600" },
                        { title: "Total Interviews", value: templates.reduce((sum, t) => sum + (t.totalAttempts || 0), 0), icon: History, color: "text-green-600" }
                    ].map((stat, i) => (
                        <Card key={i} className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden group hover:border-blue-500/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                                        <h3 className={`text-4xl font-bold text-gray-900 dark:text-white ${nohemi.className}`}>
                                            {stat.value}
                                        </h3>
                                    </div>
                                    <div className={`p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Templates Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-3xl font-bold text-gray-900 dark:text-white ${nohemi.className}`}>
                            Your Templates
                        </h2>
                    </div>
                    
                    {templates.length === 0 ? (
                        <Card className="bg-gray-50 dark:bg-gray-900 border-dashed border-2 border-gray-200 dark:border-gray-800">
                            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="p-6 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-6">
                                    <Mic className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 ${nohemi.className}`}>
                                    No Templates Yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                                    Start by creating an interview template based on your course content to practice effectively.
                                </p>
                                <Button 
                                    onClick={() => setShowCreateDialog(true)} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                >
                                    Create First Template
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <Card 
                                    key={template.templateId} 
                                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <CardTitle className={`text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mb-2 ${nohemi.className}`}>
                                                    {template.title}
                                                </CardTitle>
                                                <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                                    {template.courseName}
                                                </Badge>
                                            </div>
                                            <Badge className={
                                                template.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                template.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }>
                                                {template.difficulty}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[40px]">
                                                {template.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                {template.averageScore ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Avg. Score</span>
                                                        <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                                                            {template.averageScore}%
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">New</span>
                                                    </div>
                                                )}

                                                <Button
                                                    onClick={() => createShareableLink(template.templateId, template.title)}
                                                    size="sm"
                                                    variant="secondary"
                                                    className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white cursor-pointer"
                                                >
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Copy Link
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Links Section */}
                {links.length > 0 && (
                    <div className="mt-20">
                        <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 ${nohemi.className}`}>
                            Active Share Links
                        </h2>
                        <div className="grid gap-4">
                            {links.slice(0, 5).map((link) => (
                                <div 
                                    key={link.linkId}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group hover:border-blue-500/30 transition-colors"
                                >
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{link.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Created {new Date(link.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            onClick={() => {
                                                const url = `${window.location.origin}/interview/${link.linkId}`;
                                                navigator.clipboard.writeText(url);
                                                toast.success('Link copied!');
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => window.open(`/interview/${link.linkId}`, '_blank')}
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CreateInterviewDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onTemplateCreated={handleCreateTemplate}
            />
            
            <InterviewHistory
                open={showHistory}
                onOpenChange={setShowHistory}
            />
        </div>
    );
};

export default InterviewPage;
