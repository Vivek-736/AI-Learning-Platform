import React from 'react'
import { Book, Clock, Settings, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CourseInfoProps {
    course: any;
}

const CourseInfo = ({ course }: CourseInfoProps) => {
    const courseLayout = course?.courseJson?.course

    const calculateTotalDuration = () => {
        if (!courseLayout?.chapters) return '0 hours';
        
        const totalHours = courseLayout.chapters.reduce((total: number, chapter: any) => {
            const hours = parseInt(chapter.duration?.match(/\d+/)?.[0] || '0');
            return total + hours;
        }, 0);
        
        return `${totalHours} hours`;
    };

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
                <Button className='w-full cursor-pointer text-center  mt-3'><Settings /> Generate Content</Button>
            </div>
            <Image 
                src={course?.bannerImageUrl || '/course.jpg'}
                alt='Course Banner'
                width={400}
                height={400}
                className='w-full h-auto rounded-2xl object-cover aspect-auto'
            />
        </div>
    )
}

export default CourseInfo
