'use client';

import React, { useState, useEffect } from 'react';
import EnrollCourseList from '@/components/EnrollCourseList';
import { BookOpen, Search, GraduationCap, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';

interface Course {
    cid: string;
    name: string;
    courses: {
        name: string;
        description: string;
        courseJson: {
            course: {
                name: string;
                description: string;
            };
        };
    };
    enrollCourse: {
        completedChapters?: number[];
    };
}

const MyCourses: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await axios.get('/api/enroll-course');
            setEnrolledCourses(response.data || []);
            
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);

            setHasError(true);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4">
                <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-[#09090b]">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin"></div>
                            <div className="w-16 h-16 border-4 border-gray-100 dark:border-gray-800 border-t-gray-800 dark:border-t-gray-200 rounded-full animate-spin absolute top-2 left-2"></div>
                            <div className="w-12 h-12 border-4 border-gray-50 dark:border-gray-900 border-t-gray-700 dark:border-t-gray-300 rounded-full animate-spin absolute top-4 left-4"></div>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Loading Your Courses</h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                We&apos;re fetching your enrolled courses and progress data...
                            </p>
                        </div>

                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-gray-900 dark:bg-gray-100 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-gray-900 dark:bg-gray-100 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-3 h-3 bg-gray-900 dark:bg-gray-100 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>

                        <div className="w-full max-w-7xl mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="relative w-full h-52 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                        </div>
                                        
                                        <div className="p-5 space-y-4">
                                            <div className="space-y-3">
                                                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-4/5 animate-pulse relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                                </div>
                                                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-3/5 animate-pulse relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                                </div>
                                                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-11/12 animate-pulse relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                                </div>
                                                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-4/5 animate-pulse relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                                </div>
                                            </div>
                                            
                                            <div className="pt-2 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-24 animate-pulse relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                                    </div>
                                                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-12 animate-pulse relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                                    </div>
                                                </div>
                                                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full animate-pulse relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                                </div>
                                            </div>
                                            
                                            <div className="h-11 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl w-full animate-pulse relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer"></div>
                                            </div>
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

    if (hasError) {
        return (
            <div className="container mx-auto px-4">
                <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-gray-950">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="w-24 h-24 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <BookOpen className="h-12 w-12 text-red-500 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We couldn&apos;t load your courses. Please try refreshing the page.
                            </p>
                        </div>
                        <Button 
                            onClick={fetchEnrolledCourses}
                            className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (enrolledCourses.length === 0) {
        return (
            <div className="container mx-auto px-4">
                <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-gray-950">
                    <div className="text-center space-y-8 max-w-2xl">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <GraduationCap className="h-16 w-16 text-gray-900 dark:text-gray-100" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                                <Star className="h-4 w-4 text-white" fill="currentColor" />
                            </div>
                            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 dark:bg-green-500 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-3 w-3 text-white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                                Start Your Learning Journey
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                                You haven&apos;t enrolled in any courses yet. Discover amazing courses 
                                created by our community and start building new skills today.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                                    <BookOpen className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quality Content</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Learn from expertly crafted courses with practical examples
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Easy Discovery</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Find courses that match your interests and skill level
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                                    <GraduationCap className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Track Progress</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Monitor your learning journey and celebrate achievements
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link href="/workspace/explore">
                                <Button 
                                    size="lg" 
                                    className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform cursor-pointer"
                                >
                                    <Search className="mr-2 h-5 w-5" />
                                    Explore Courses
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
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
