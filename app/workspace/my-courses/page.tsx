'use client';

import React, { useState, useEffect } from 'react';
import EnrollCourseList from '@/components/EnrollCourseList';

const MyCourses: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4">
                <div className="min-h-[70vh] flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
                            <div className="w-16 h-16 border-4 border-gray-100 border-t-purple-400 rounded-full animate-spin absolute top-2 left-2"></div>
                            <div className="w-12 h-12 border-4 border-gray-50 border-t-purple-300 rounded-full animate-spin absolute top-4 left-4"></div>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">Loading Your Courses</h2>
                            <p className="text-gray-600 max-w-md">
                                We&apos;re fetching your enrolled courses and progress data...
                            </p>
                        </div>

                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>

                        <div className="w-full max-w-6xl mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((index) => (
                                    <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                                        <div className="w-full h-48 bg-gray-200"></div>
                                        
                                        <div className="p-4 space-y-3">
                                            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                            
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded"></div>
                                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded"></div>
                                            </div>
                                            
                                            <div className="h-10 bg-gray-200 rounded w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 -mt-10">
            <EnrollCourseList refreshTrigger={0} />
        </div>
    );
};

export default MyCourses;
