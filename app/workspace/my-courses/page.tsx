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

    if (hasError) {
        return (
            <div className="container mx-auto px-4">
                <div className="min-h-[70vh] flex items-center justify-center">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <BookOpen className="h-12 w-12 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                            <p className="text-gray-600 mb-6">
                                We couldn&apos;t load your courses. Please try refreshing the page.
                            </p>
                        </div>
                        <Button 
                            onClick={fetchEnrolledCourses}
                            className="bg-purple-600 hover:bg-purple-700"
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
                <div className="min-h-[70vh] flex items-center justify-center">
                    <div className="text-center space-y-8 max-w-2xl">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <GraduationCap className="h-16 w-16 text-purple-600" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Star className="h-4 w-4 text-white" fill="currentColor" />
                            </div>
                            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-3 w-3 text-white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-gray-900">
                                Start Your Learning Journey
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                You haven&apos;t enrolled in any courses yet. Discover amazing courses 
                                created by our community and start building new skills today.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                                    <BookOpen className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">Quality Content</h3>
                                <p className="text-sm text-gray-600">
                                    Learn from expertly crafted courses with practical examples
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">Easy Discovery</h3>
                                <p className="text-sm text-gray-600">
                                    Find courses that match your interests and skill level
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <GraduationCap className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">Track Progress</h3>
                                <p className="text-sm text-gray-600">
                                    Monitor your learning journey and celebrate achievements
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link href="/workspace/explore">
                                <Button 
                                    size="lg" 
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform cursor-pointer"
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
