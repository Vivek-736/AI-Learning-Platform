'use client';

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EnrolledCourseCard from './EnrolledCourseCard';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface EnrolledCourse {
    courses: any;
    enrollCourse: any;
}

interface EnrollCourseListProps {
    refreshTrigger: number;
}

const EnrollCourseList: React.FC<EnrollCourseListProps> = ({ refreshTrigger }) => {
    const [enrolledCourseList, setEnrolledCourseList] = useState<EnrolledCourse[]>([]);

    useEffect(() => {
        GetEnrolledCourses();
    }, [refreshTrigger])

    const GetEnrolledCourses = async (): Promise<void> => {
        try {
            const result = await axios.get('/api/enroll-course');
            // console.log(result.data);
            setEnrolledCourseList(result.data);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        }
    }

    return enrolledCourseList?.length > 0 ? (
        <div className='mt-10'>
            <h1 className='text-xl font-bold mb-4'>Continue Learning</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-4'>
                {enrolledCourseList.map((course, index) => (
                    <EnrolledCourseCard 
                        key={index}
                        course={course?.courses}
                        enrollCourse={course?.enrollCourse}
                    />
                ))}
            </div>
        </div>
    ) : null
}

export default EnrollCourseList
