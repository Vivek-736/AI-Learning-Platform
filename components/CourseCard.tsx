import { Book, PlayCircle, Settings } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CourseCardProps {
    course: any;
}

const CourseCard = ({ course }: CourseCardProps) => {
    const courseLayout = course?.courseJson?.course
    return (
        <div className='rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] mt-4'>
            <Image 
                src={course?.bannerImageUrl || '/course.jpg'}
                alt='Course Banner'
                width={400}
                height={400}
                className='w-full rounded-t-2xl object-cover aspect-video'
            />
            <div className='p-3 flex flex-col gap-3'>
                <h2 className='font-bold text-lg line-clamp-1'>{courseLayout?.name}</h2>
                <p className='line-clamp-2 text-gray-500 text-sm'>{courseLayout?.description}</p>
                <div className='flex justify-between items-center'>
                    <h2 className='flex items-center gap-2 text-sm'><Book className='h-5 w-5 text-primary' /> {courseLayout?.noOfChapters} Chapters</h2>
                    {course?.courseContent?.length ? <Button className='cursor-pointer' size={'sm'}><PlayCircle /> Start Learning</Button> : <Button size={'sm'} className='cursor-pointer' variant={'outline'}><Settings /> Generate Course</Button>}
                </div>
            </div>
        </div>
    )
}

export default CourseCard
