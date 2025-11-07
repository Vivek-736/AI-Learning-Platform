'use client';

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import axios from 'axios';
import CourseInfo from '../components/CourseInfo';
import ChapterTopicList from '../components/ChapterTopicList';

interface EditCoursePageProps {
    viewCourse?: boolean;
}

const EditCoursePage = ({ viewCourse = false }: EditCoursePageProps) => {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState();
    const [enrollCourse, setEnrollCourse] = useState();

    useEffect(() => {
        if (viewCourse) {
            GetEnrolledCourseInfo();
        } else {
            GetCourseInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewCourse]);

    const GetCourseInfo = async () => {
        setLoading(true);
        try {
            const result = await axios.get(`/api/courses?courseId=${courseId}`);
            // console.log(result.data);
            setCourse(result.data);
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    }

    const GetEnrolledCourseInfo = async () => {
        setLoading(true);
        try {
            const result = await axios.get(`/api/enroll-course?courseId=${courseId}`);
            // console.log(result.data);
            setCourse(result.data?.courses);
            setEnrollCourse(result.data?.enrollCourse);
        } catch (error) {
            console.error('Error fetching enrolled course:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-[78vh] bg-[#FFFFFF] flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#000B88] rounded-full animate-spin"></div>
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#000B88] rounded-full animate-spin absolute top-2 left-2 animate-reverse-spin"></div>
                    </div>
                                     
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-black mb-2">Loading Course</h2>
                        <p className="text-gray-600">Please wait while we fetch your course details...</p>
                    </div>
                                     
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#000B88] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#000B88] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-[#000B88] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <CourseInfo course={course} viewCourse={viewCourse} />
            <ChapterTopicList course={course} enrollCourse={enrollCourse} />
        </div>
    )
}

export default EditCoursePage
