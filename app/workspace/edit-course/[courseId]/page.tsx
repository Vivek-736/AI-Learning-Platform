'use client';

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import axios from 'axios';
import CourseInfo from '../components/CourseInfo';
import ChapterTopicList from '../components/ChapterTopicList';

const EditCoursePage = () => {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState();

    useEffect(() => {
        GetCourseInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const GetCourseInfo = async () => {
        setLoading(true);
        const result = await axios.get(`/api/courses?courseId=${courseId}`);
        console.log(result.data);
        setLoading(false);
        setCourse(result.data);
    }

    return (
        <div>
            <CourseInfo course={course} />
            <ChapterTopicList course={course} />
        </div>
    )
}

export default EditCoursePage
