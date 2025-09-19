'use client';

import React from 'react'
import { TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

const Welcome = () => {
    const { user } = useUser();

    return (
        <div className='relative p-6 bg-gradient-to-r from-white via-purple-50/30 to-white border border-purple-100/50 rounded-xl mb-6 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full -translate-y-8 translate-x-8'></div>
            <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-50/30 to-transparent rounded-full translate-y-6 -translate-x-6'></div>
            <div className='relative z-10'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25'>
                        <Image 
                            src="/favicon.png"
                            alt="EruditeAI Logo"
                            width={32}
                            height={32}
                            className='w-8 h-8 object-contain'
                        />
                    </div>
                    <div className='flex-1'>
                        <h2 className='font-semibold text-xl text-gray-900 flex items-center gap-2'>
                            Welcome to EruditeAI! <span className='text-purple-500 font-medium'>{user?.firstName}</span>
                        </h2>
                    </div>
                    <div className='flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full'>
                        <TrendingUp className='w-3 h-3' />
                        Active
                    </div>
                </div>
                
                <div className='ml-13'>
                    <p className='text-gray-600 mb-2'>Learn, Create and Explore your AI Courses</p>
                    <div className='flex items-center gap-4 text-xs text-gray-500'>
                        <span className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
                            Smart Learning Enabled
                        </span>
                        <span className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                            AI Assistant Ready
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome
