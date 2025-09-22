'use client';

import React, { useEffect, useState } from 'react'
import AppHeader from '@/components/AppHeader'
import ChapterListSidebar from '../components/ChapterListSidebar'
import ChapterContent from '../components/ChapterContent'
import axios from 'axios';
import { useParams } from 'next/navigation';

const CoursePage = () => {
    const { courseId } = useParams();

    const [courseInfo, setCourseInfo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetEnrolledCoursesById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
        
    const GetEnrolledCoursesById = async () => {
        setLoading(true);
        try {
            const result = await axios.get('/api/enroll-course?courseId=' + courseId);
            console.log(result.data);
            setCourseInfo(result.data);
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div>
                <AppHeader hideSidebar={true} />
                <div className='min-h-[78vh] bg-white flex items-center justify-center'>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
                            <div className="w-12 h-12 border-4 border-gray-100 border-t-purple-400 rounded-full animate-spin absolute top-2 left-2"></div>
                        </div>
                        
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-black mb-2">Loading Course Content</h2>
                            <p className="text-gray-600">Please wait while we fetch your course materials...</p>
                        </div>
                        
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AppHeader hideSidebar={true} />
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-10'>
                <ChapterListSidebar courseInfo={courseInfo} />
                <ChapterContent courseInfo={courseInfo} refreshData={() => GetEnrolledCoursesById()} />
            </div>
        </div>
    )
}

export default CoursePage
