'use client';

import React from 'react';
import { Brain, MessageSquare, Mic, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const AiToolsPage = () => {
    const tools = [
        {
            title: 'Quiz Generator',
            description: 'Generate AI-powered quizzes from your courses',
            icon: <Brain className="h-12 w-12" />,
            href: '/workspace/ai-tools/quiz',
            available: true,
            color: 'from-blue-500 to-blue-600',
            borderColor: 'border-blue-200',
        },
        {
            title: 'Flashcards',
            description: 'Create smart flashcards for better learning',
            icon: <MessageSquare className="h-12 w-12" />,
            href: '/workspace/ai-tools/flashcard',
            available: true,
            color: 'from-green-500 to-green-600',
            borderColor: 'border-green-200',
        },
        {
            title: 'Voice Interview',
            description: 'Practice interviews with proper AI feedback',
            icon: <Mic className="h-12 w-12" />,
            href: '/workspace/ai-tools/interview',
            available: true,
            color: 'from-orange-500 to-orange-600',
            borderColor: 'border-orange-200',
        }
    ];

    return (
        <div className="min-h-[76vh] flex justify-center items-center bg-gradient-to-b from-white via-purple-50/30 to-white">
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-16 text-center">   
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Master Learning with <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI Tools</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tools.map((tool) => (
                        <div key={tool.title}>
                            <Link href={tool.href}>
                                <Card className={`h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${tool.borderColor} overflow-hidden`}>
                                    <div className={`bg-gradient-to-br rounded-xl ${tool.color} p-0 relative overflow-hidden -mt-6`}>
                                        <div className="relative flex items-center justify-center h-48 text-white">
                                            {tool.icon}
                                        </div>
                                    </div>
                                    <CardHeader className="text-center pt-2">
                                        <CardTitle className="text-2xl font-bold text-gray-900">
                                            {tool.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center pb-8">
                                        <p className="text-gray-600 mb-8 leading-relaxed">
                                            {tool.description}
                                        </p>
                                        {tool.available ? (
                                            <Button className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-xl">
                                                Get Started
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button disabled className="w-full cursor-not-allowed bg-gray-200 text-gray-500 font-medium py-2.5 rounded-lg">
                                                Coming Soon
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AiToolsPage;
