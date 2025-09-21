import React from 'react'
import EditCoursePage from '../../edit-course/[courseId]/page';

const ViewCoursePage = () => {
    return (
        <div>
            <EditCoursePage viewCourse={true} />
        </div>
    )
}

export default ViewCoursePage
