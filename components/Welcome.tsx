'use client';

import React, { useState } from 'react'

const Welcome = () => {
    const [isHovered, setIsHovered] = useState(false)
    
    return (
        <div 
            className="relative overflow-hidden p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse"></div>
            <div className="absolute inset-0">
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-100"></div>
                <div className="absolute top-8 right-8 w-3 h-3 bg-yellow-300/40 rounded-full animate-bounce delay-300"></div>
                <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-pink-300/50 rounded-full animate-bounce delay-500"></div>
                <div className="absolute bottom-4 right-4 w-2.5 h-2.5 bg-blue-300/40 rounded-full animate-bounce delay-700"></div>
            </div>
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl transition-all duration-700 ${isHovered ? 'scale-150 opacity-30' : 'scale-100 opacity-20'}`}></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">🤖</div>
                    <h2 className="font-bold text-2xl text-white tracking-tight">
                        Welcome to 
                        <span className="ml-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent font-extrabold">
                            EruditeAI
                        </span>
                    </h2>
                </div>
                <p className="text-white/90 text-base leading-relaxed flex items-center gap-2">
                    📚 Learn, 🎨 Create and 🔍 Explore your AI Courses ✨
                </p>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-bl-full"></div>
        </div>
    )
}

export default Welcome
