'use client';

import CourseList from '@/components/CourseList'
import Welcome from '@/components/Welcome'
import React, { useState } from 'react'
import EnrollCourseList from '@/components/EnrollCourseList'

const WorkspacePage: React.FC = () => {
    const [enrolledCoursesRefresh, setEnrolledCoursesRefresh] = useState<number>(0);
    
    const refreshEnrolledCourses = (): void => {
        setEnrolledCoursesRefresh(prev => prev + 1);
    };

    return (
        <div>
            <Welcome />
            <EnrollCourseList refreshTrigger={enrolledCoursesRefresh} />
            <CourseList onCourseEnrolled={refreshEnrolledCourses} />
        </div>
    )
}

export default WorkspacePage
