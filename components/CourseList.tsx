'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import AddNewCourseDialog from './AddNewCourseDialog';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import CourseCard from './CourseCard';

const CourseList = () => {
    const { user } = useUser();
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            GetCourseList();
        }
    }, [user]);

    const GetCourseList = async () => {
        setLoading(true);
        try {
            const result = await axios.get('/api/courses');
            console.log(result.data);
            setCourseList(result.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='mt-10'>
            <h2 className='font-bold text-3xl'>
                Course List
            </h2>
            
            {loading ? (
                <div className='flex items-center justify-center mt-6 p-20'>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
                            <div className="w-8 h-8 border-4 border-gray-100 border-t-purple-400 rounded-full animate-spin absolute top-2 left-2"></div>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-gray-600">Loading your courses...</p>
                        </div>
                        
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                </div>
            ) : courseList?.length == 0 ? (
                <div className='flex p-7 gap-y-3 items-center justify-center flex-col border-black border-dashed border-2 rounded-xl mt-6 bg-purple-50'>
                    <Image src={'/workspace.png'} alt='education' width={80} height={80} />
                    <h2 className='my-2 text-xl font-bold'>Looks like you haven&apos;t created any course yet</h2>
                    <AddNewCourseDialog>
                        <Button className='cursor-pointer'>
                            Create your first course
                        </Button>
                    </AddNewCourseDialog>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                    {courseList?.map((course, index) => (
                        <CourseCard 
                            course={course} 
                            key={index} 
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default CourseList
