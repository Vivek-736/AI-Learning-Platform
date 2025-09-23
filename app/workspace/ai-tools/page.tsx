'use client';

import React from 'react';
import { Brain, MessageSquare, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const AiToolsPage = () => {
    const tools = [
        {
            title: 'Quiz Generator',
            description: 'Generate AI-powered quizzes from your courses',
            icon: <Brain className="h-8 w-8" />,
            href: '/workspace/ai-tools/quiz',
            available: true
        },
        {
            title: 'Flashcards',
            description: 'Create smart flashcards for better learning',
            icon: <MessageSquare className="h-8 w-8" />,
            href: '/workspace/ai-tools/flashcard',
            available: true
        },
        {
            title: 'Voice Interview',
            description: 'Practice interviews with AI feedback',
            icon: <Mic className="h-8 w-8" />,
            href: '/workspace/ai-tools/interview',
            available: true
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Learning Tools</h1>
                <p className="text-gray-600">Enhance your learning with AI-powered tools</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tools.map((tool) => (
                    <Card key={tool.title} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 text-blue-600">
                                {tool.icon}
                            </div>
                            <CardTitle className="text-xl">{tool.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-600 mb-4">{tool.description}</p>
                            {tool.available ? (
                                <Link href={tool.href}>
                                    <Button className="w-full cursor-pointer">
                                        Get Started
                                    </Button>
                                </Link>
                            ) : (
                                <Button disabled className="w-full cursor-pointer">
                                    Coming Soon
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AiToolsPage;
