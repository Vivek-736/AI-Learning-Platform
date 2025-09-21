'use client';

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EnrolledCourseCard from './EnrolledCourseCard';

const EnrollCourseList = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [enrolledCourseList, setEnrolledCourseList] = useState<any[]>([]);

    useEffect(() => {
        GetEnrolledCourses();
    }, [])

    const GetEnrolledCourses = async () => {
        const result = await axios.get('/api/enroll-course');
        console.log(result.data);
        setEnrolledCourseList(result.data);
    }

    return enrolledCourseList?.length > 0 && (
        <div className='mt-10'>
            <h1 className='text-xl font-bold mb-4'>Continue Learning</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-4'>
                {enrolledCourseList.map((course, index) => (
                    <EnrolledCourseCard 
                        key={index}
                        course={course?.courses}
                        enrollCourse={course?.enrollCourse}
                    /> 
                ))}
            </div>
        </div>
    )
}

export default EnrollCourseList
