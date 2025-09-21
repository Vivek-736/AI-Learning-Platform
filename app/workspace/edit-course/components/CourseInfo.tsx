'use client';

import React, { useState } from 'react'
import { Book, Clock, Loader, PlayCircle, Settings, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CourseInfoProps {
    course: any;
    viewCourse: boolean;
}

const CourseInfo = ({ course, viewCourse }: CourseInfoProps) => {
    const courseLayout = course?.courseJson?.course
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const calculateTotalDuration = () => {
        if (!courseLayout?.chapters) return '0 hours';
        
        const totalHours = courseLayout.chapters.reduce((total: number, chapter: any) => {
            const hours = parseInt(chapter.duration?.match(/\d+/)?.[0] || '0');
            return total + hours;
        }, 0);
        
        return `${totalHours} hours`;
    };

    const GenerateCourseContent = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/generate-course-content', {
                courseJson: courseLayout,
                courseTitle: course?.name,
                courseId: course?.cid
            });
            console.log(result.data);
            setLoading(false);
            router.replace('/workspace');
            toast.success('Course generated successfully!');
        } catch (error) {
            setLoading(false);
            console.error(error);
            toast.error('An error occurred while generating course content. Please try again.');
        }
    }

    return (
        <div className='flex md:flex-row flex-col-reverse gap-5 justify-between p-5 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)]'>
            <div>
                <h2 className='font-bold text-2xl'>
                    {courseLayout?.name}
                </h2>
                <p className='line-clamp-2 mt-2'>
                    {courseLayout?.description}
                </p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                    <div className='flex gap-4 items-center p-3 rounded-lg shadow'>
                        <Clock className='text-blue-500' />
                        <section>
                            <h2 className='font-bold'>Duration</h2>
                            <h3>{calculateTotalDuration()}</h3>
                        </section>
                    </div>
                    <div className='flex gap-4 items-center p-3 rounded-lg shadow'>
                        <Book className='text-green-500' />
                        <section>
                            <h2 className='font-bold'>Chapters</h2>
                            <h3>{calculateTotalDuration()}</h3>
                        </section>
                    </div>
                    <div className='flex gap-4 items-center p-3 rounded-lg shadow'>
                        <TrendingUp className='text-red-500' />
                        <section>
                            <h2 className='font-bold'>Difficulty</h2>
                            <h3>{courseLayout?.level}</h3>
                        </section>
                    </div>
                </div>
                {!viewCourse ? <Button onClick={GenerateCourseContent} className='w-full cursor-pointer text-center mt-3' disabled={loading}>{!loading ? <Settings /> : <Loader className='animate-spin' />} {!loading ? 'Generate Content' : 'Generating Content'}</Button>: <Link href={`/course/${course?.cid}`}><Button className='w-full cursor-pointer text-center mt-3'>
                    <PlayCircle /> Continue Learning
                </Button></Link>}
            </div>
            <Image 
                src={course?.bannerImageUrl || '/course.jpg'}
                alt='Course Banner'
                width={400}
                height={400}
                className='rounded-2xl object-cover aspect-auto'
            />
        </div>
    )
}

export default CourseInfo
