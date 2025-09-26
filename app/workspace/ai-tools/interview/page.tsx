'use client';

import React, { useEffect, useState } from 'react';
import { Mic, Plus, History, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateInterviewDialog from './components/CreateInterviewDialog';
import InterviewHistory from './components/InterviewHistory';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

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
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Voice Interviews</h1>
                    <p className="text-gray-600">Create and manage course-based interview templates</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => setShowHistory(true)} variant="outline" className='cursor-pointer'>
                        <History className="h-4 w-4 mr-2" />
                        History
                    </Button>
                    <Button onClick={() => setShowCreateDialog(true)} className='cursor-pointer'>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Interview
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Templates Created</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{templates.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Active Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{links.filter(l => l.isActive).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {templates.reduce((sum, t) => sum + (t.totalAttempts || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Interview Templates</h2>
                
                {templates.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <Mic className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No interview templates yet</h3>
                            <p className="text-gray-500 mb-6">Create your first interview template based on your courses</p>
                            <Button onClick={() => setShowCreateDialog(true)} className='cursor-pointer'>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Template
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <Card key={template.templateId} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg line-clamp-1">{template.title}</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{template.courseName}</p>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <Badge>{template.difficulty}</Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600 line-clamp-1">{template.description}</p>

                                        {template.averageScore && (
                                            <div className="text-sm">
                                                <span className="text-gray-600">Avg Score: </span>
                                                <span className="font-semibold text-blue-600">
                                                    {template.averageScore}/100
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => createShareableLink(template.templateId, template.title)}
                                                size="sm"
                                                className="flex-1 cursor-pointer"
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
            {links.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Shareable Links</h2>
                    <div className="space-y-4">
                        {links.slice(0, 5).map((link) => (
                            <Card key={link.linkId}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">{link.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                Created {new Date(link.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => {
                                                    const url = `${window.location.origin}/interview/${link.linkId}`;
                                                    navigator.clipboard.writeText(url);
                                                    toast.success('Link copied!');
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className='cursor-pointer'
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => window.open(`/interview/${link.linkId}`, '_blank')}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

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
