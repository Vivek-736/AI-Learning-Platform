'use client';

import React, { useEffect, useState } from 'react'
import { Trophy, Zap, Target, Code, GraduationCap, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

interface XPData {
    totalXp: number;
    courseCompletionXp: number;
    quizXp: number;
    interviewXp: number;
    flashcardXp: number;
    codingXp: number;
}

const Welcome = () => {
    const { user } = useUser();
    const [xpData, setXpData] = useState<XPData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchXP = async () => {
            if (!user?.primaryEmailAddress?.emailAddress) return;
            
            setIsLoading(true);
            try {
                const response = await fetch(`/api/xp?userEmail=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`);
                if (response.ok) {
                    const data = await response.json();
                    setXpData(data);
                }
            } catch (error) {
                console.error('Error fetching XP:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchXP();
    }, [user]);

    const getLevel = (xp: number) => {
        return Math.floor(xp / 100) + 1;
    };

    const getXPToNextLevel = (xp: number) => {
        const currentLevel = getLevel(xp);
        const xpForNextLevel = currentLevel * 100;
        return xpForNextLevel - xp;
    };

    const getProgressPercentage = (xp: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const level = getLevel(xp);
        const xpInCurrentLevel = xp % 100;
        return (xpInCurrentLevel / 100) * 100;
    };

    return (
        <div className='relative p-4 md:p-6 bg-gradient-to-r from-white via-purple-50/30 to-white border border-gray-200/50 rounded-xl mb-6 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full -translate-y-8 translate-x-8'></div>
            <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-50/30 to-transparent rounded-full translate-y-6 -translate-x-6'></div>
            
            <div className='relative z-10'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-sm border border-gray-400 bg-black'>
                            <Image 
                                src="/favicon.png"
                                alt="Fascinity Logo"
                                width={32}
                                height={32}
                                className='w-6 h-6 md:w-8 md:h-8 object-contain'
                            />
                        </div>
                        <div className='flex-1'>
                            <h2 className='font-bold text-base md:text-xl text-gray-900 flex flex-wrap items-center gap-2'>
                                Welcome back, 
                                <span className='bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent'>
                                    {user?.firstName || 'Learner'}
                                </span>
                                <Sparkles className='w-4 h-4 text-purple-500' />
                            </h2>
                            <p className='text-xs md:text-sm text-gray-500 mt-0.5'>
                                Continue your learning journey
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        {isLoading ? (
                            <div className='flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200'>
                                <div className='w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
                                <span className='text-sm text-gray-600 font-medium'>Loading XP...</span>
                            </div>
                        ) : xpData ? (
                            <div className='flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-full border border-purple-200/50'>
                                <div className='flex items-center gap-1.5'>
                                    <Trophy className='w-5 h-5 text-purple-600' />
                                    <div className='flex flex-col'>
                                        <span className='text-xs text-purple-600 font-medium'>Level {getLevel(xpData.totalXp)}</span>
                                        <span className='text-[10px] text-purple-500'>
                                            {getXPToNextLevel(xpData.totalXp)} XP to next
                                        </span>
                                    </div>
                                </div>
                                <div className='h-8 w-px bg-purple-200'></div>
                                <div className='flex flex-col items-end'>
                                    <span className='text-sm font-bold text-purple-700'>{xpData.totalXp.toLocaleString()}</span>
                                    <span className='text-[10px] text-purple-500 font-medium'>Total XP</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {!isLoading && xpData && (
                    <div className='mb-4'>
                        <div className='flex items-center justify-between mb-1.5'>
                            <span className='text-xs text-gray-600 font-medium ml-0.5 mb-0.5'>
                                Level Progress
                            </span>
                            <span className='text-xs text-purple-600 font-semibold'>
                                {Math.round(getProgressPercentage(xpData.totalXp))}%
                            </span>
                        </div>
                        <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
                            <div 
                                className='h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out mr-0.5 mb-0.5'
                                style={{ width: `${getProgressPercentage(xpData.totalXp)}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {!isLoading && xpData && (
                    <div className='grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3'>
                        <div className='flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-300'>
                            <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center'>
                                <GraduationCap className='w-4 h-4 text-blue-600' />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-xs text-gray-500'>Courses</span>
                                <span className='text-sm font-bold text-gray-900'>{xpData.courseCompletionXp}{" "}XP</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-300'>
                            <div className='w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center'>
                                <Target className='w-4 h-4 text-green-600' />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-xs text-gray-500'>Quizzes</span>
                                <span className='text-sm font-bold text-gray-900'>{xpData.quizXp}{" "}XP</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-300'>
                            <div className='w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center'>
                                <Zap className='w-4 h-4 text-purple-600' />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-xs text-gray-500'>Flashcards</span>
                                <span className='text-sm font-bold text-gray-900'>{xpData.flashcardXp}{" "}XP</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-300'>
                            <div className='w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center'>
                                <Code className='w-4 h-4 text-rose-600' />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-xs text-gray-500'>Coding</span>
                                <span className='text-sm font-bold text-gray-900'>{xpData.codingXp}{" "}XP</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-300'>
                            <div className='w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center'>
                                <Trophy className='w-4 h-4 text-orange-600' />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-xs text-gray-500'>Interviews</span>
                                <span className='text-sm font-bold text-gray-900'>{xpData.interviewXp}{" "}XP</span>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className='grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3'>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className='h-16 bg-gray-100 rounded-lg animate-pulse'></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Welcome
