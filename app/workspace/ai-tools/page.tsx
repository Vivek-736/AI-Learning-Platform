'use client';

import React from 'react';
import { Brain, MessageSquare, Mic, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import XpDisplay from '@/components/XpDisplay';
import { motion } from 'framer-motion';
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

const AiToolsPage = () => {
    const tools = [
        {
            title: 'Quiz Generator',
            description: 'Test your knowledge with AI-generated questions',
            tagline: 'Challenge yourself',
            icon: Brain,
            href: '/workspace/ai-tools/quiz',
            iconColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-gray-200 dark:border-gray-800',
        },
        {
            title: 'Flashcards',
            description: 'Master concepts with smart repetition learning',
            tagline: 'Learn smarter',
            icon: MessageSquare,
            href: '/workspace/ai-tools/flashcard',
            iconColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-gray-200 dark:border-gray-800',
        },
        {
            title: 'Voice Interview',
            description: 'Practice real-world interviews with AI feedback',
            tagline: 'Speak confidently',
            icon: Mic,
            href: '/workspace/ai-tools/interview',
            iconColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-gray-200 dark:border-gray-800',
        }
    ];

    return (
        <div className={`min-h-[76vh] bg-white dark:bg-gray-950 ${nohemi.variable}`}>
            <div className="max-w-7xl mx-auto p-6 py-12">
                <div className="mb-16 flex items-center justify-between">   
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span className={`text-sm text-purple-600 dark:text-purple-400 font-medium tracking-wide ${nohemi.className}`}>
                                AI-POWERED TOOLS
                            </span>
                        </div>
                        <h1 className={`text-4xl md:text-5xl font-serif text-gray-900 dark:text-gray-100 leading-tight font-light`}>
                            Master Learning with{' '}
                            <span className="text-purple-600 dark:text-purple-400 font-serif">AI</span>
                        </h1>
                    </div>
                    <XpDisplay />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tools.map((tool, index) => {
                        const Icon = tool.icon;
                        return (
                            <motion.div
                                key={tool.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={tool.href}>
                                    <div className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border ${tool.borderColor} hover:shadow-lg transition-all duration-300 cursor-pointer h-full`}>
                                        
                                        <div className="relative p-8">
                                            <div className="mb-6">
                                                <div className={`inline-flex p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group-hover:scale-110 transition-transform duration-300`}>
                                                    <Icon className={`w-8 h-8 ${tool.iconColor}`} />
                                                </div>
                                            </div>

                                            <div className="mb-8">
                                                <h3 className={`text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 ${nohemi.className}`}>
                                                    {tool.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed font-serif">
                                                    {tool.description}
                                                </p>
                                                <span className={`inline-block text-xs font-medium ${tool.iconColor} ${nohemi.className} tracking-wide`}>
                                                    {tool.tagline}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${nohemi.className} group-hover:translate-x-1 transition-transform duration-300`}>
                                                    Get Started
                                                </span>
                                                <div className={`p-2 rounded-full ${tool.iconColor} bg-gray-50 dark:bg-gray-800 group-hover:translate-x-2 transition-transform duration-300`}>
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-serif">
                        Powered by advanced AI to enhance your learning experience
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AiToolsPage;
