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
            gradient: 'from-purple-600/10 via-purple-500/5 to-transparent',
            iconColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-purple-200/50 dark:border-purple-800/50',
            hoverShadow: 'hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50',
        },
        {
            title: 'Flashcards',
            description: 'Master concepts with smart repetition learning',
            tagline: 'Learn smarter',
            icon: MessageSquare,
            href: '/workspace/ai-tools/flashcard',
            gradient: 'from-pink-600/10 via-pink-500/5 to-transparent',
            iconColor: 'text-pink-600 dark:text-pink-400',
            borderColor: 'border-pink-200/50 dark:border-pink-800/50',
            hoverShadow: 'hover:shadow-pink-200/50 dark:hover:shadow-pink-900/50',
        },
        {
            title: 'Voice Interview',
            description: 'Practice real-world interviews with AI feedback',
            tagline: 'Speak confidently',
            icon: Mic,
            href: '/workspace/ai-tools/interview',
            gradient: 'from-indigo-600/10 via-indigo-500/5 to-transparent',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            borderColor: 'border-indigo-200/50 dark:border-indigo-800/50',
            hoverShadow: 'hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/50',
        }
    ];

    return (
        <div className={`min-h-[76vh] bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 ${nohemi.variable}`}>
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
                                    <div className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border ${tool.borderColor} ${tool.hoverShadow} hover:shadow-2xl transition-all duration-500 cursor-pointer h-full`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                        
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/20 dark:from-purple-900/20 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-50/30 dark:from-purple-950/30 to-transparent rounded-full translate-y-6 -translate-x-6 group-hover:scale-150 transition-transform duration-500"></div>

                                        <div className="relative p-8">
                                            <div className="mb-6">
                                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-sm border border-purple-100 dark:border-purple-900/50 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
                                                <div className={`p-2 rounded-full ${tool.iconColor} bg-purple-50 dark:bg-purple-950/50 group-hover:translate-x-2 transition-transform duration-300`}>
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-xl"></div>
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
