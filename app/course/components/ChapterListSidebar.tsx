'use client';

import React, { useContext } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectedChapterIndexContext } from '@/context/selectedChapterIndexContext';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
interface ChapterListSidebarProps {
    courseInfo: any;
}

const ChapterListSidebar = ({ courseInfo }: ChapterListSidebarProps) => {
    const course = courseInfo?.courses;
    const enrollCourse = courseInfo?.enrollCourse;
    const courseContent = courseInfo?.courses?.courseContent;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);

    return (
        <div className='w-full lg:w-80 bg-secondary min-h-screen p-5 border-r border-gray-200'>
            <div className='mb-6'>
                <h2 className='text-2xl font-bold text-black mb-2'>Course Content</h2>
                <p className='text-sm text-gray-600'>Chapters ({courseContent?.length})</p>
            </div>
            
            <Accordion type='single' collapsible className='space-y-2'>
                {courseContent?.map((chapter: any, index: React.Key | null | undefined) => (
                    <AccordionItem 
                        value={chapter?.courseData?.chapterName || chapter?.courseData?.[0]?.chapterName} 
                        key={index} 
                        className='border border-gray-200 rounded-lg overflow-hidden'
                        onClick={() => setSelectedChapterIndex(index)}
                    >
                        <AccordionTrigger className='font-medium text-base px-4 py-3 hover:bg-purple-50 text-left'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                                    {Number(index) + 1}
                                </div>
                                <span className='text-black'>
                                    {chapter?.courseData?.chapterName || chapter?.courseData?.[0]?.chapterName}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent asChild>
                            <div className='bg-white border-t border-gray-200'>
                                {(chapter?.courseData?.[0]?.topics || chapter?.courseData?.topics)?.map((topic: any, topicIndex: any) => (
                                    <div 
                                        key={topicIndex} 
                                        className='p-3 border-b last:border-0 cursor-pointer hover:bg-purple-50 transition-colors duration-150'
                                    >
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
                                            <span className='text-gray-700 text-sm'>
                                                {topic?.topic}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default ChapterListSidebar
