import CourseList from '@/components/CourseList'
import Welcome from '@/components/Welcome'
import React from 'react'
import EnrollCourseList from '@/components/EnrollCourseList'

const WorkspacePage = () => {
    return (
        <div>
            <Welcome />
            <EnrollCourseList />
            <CourseList />
        </div>
    )
}

export default WorkspacePage
