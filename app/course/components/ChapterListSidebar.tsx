'use client';

import React, { useContext } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectedChapterIndexContext } from '@/context/selectedChapterIndexContext';
import { CheckCircle } from 'lucide-react';

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

    const completedChapters = enrollCourse?.completedChapters ?? [];

    const isChapterCompleted = (chapterIndex: number) => {
        return completedChapters.includes(chapterIndex);
    };

    return (
        <div className='w-full lg:w-80 bg-secondary min-h-screen p-5 border-r border-gray-200'>
            <div className='mb-6'>
                <h2 className='text-2xl font-bold text-black mb-2'>Course Content</h2>
                <p className='text-sm text-gray-600'>Chapters ({courseContent?.length})</p>
                <div className='mt-2 text-sm text-green-600'>
                    Completed: {completedChapters?.length || 0}/{courseContent?.length || 0}
                </div>
            </div>
                     
            <Accordion type='single' collapsible className='space-y-2'>
                {courseContent?.map((chapter: any, index: React.Key | null | undefined) => {
                    const chapterCompleted = isChapterCompleted(Number(index));
                    const isSelected = selectedChapterIndex === index;
                    
                    return (
                        <AccordionItem
                            value={chapter?.courseData?.chapterName || chapter?.courseData?.[0]?.chapterName}
                            key={index}
                            className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                                chapterCompleted 
                                    ? 'border-green-300 bg-green-50' 
                                    : isSelected 
                                        ? 'border-purple-300 bg-purple-50' 
                                        : 'border-gray-200'
                            }`}
                            onClick={() => setSelectedChapterIndex(index)}
                        >
                            <AccordionTrigger className={`font-medium text-base px-4 py-3 text-left transition-colors duration-200 ${
                                chapterCompleted 
                                    ? 'hover:bg-green-100' 
                                    : 'hover:bg-purple-50'
                            }`}>
                                <div className='flex items-center gap-3 w-full'>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        chapterCompleted 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-purple-600 text-white'
                                    }`}>
                                        {chapterCompleted ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            Number(index) + 1
                                        )}
                                    </div>
                                    <span className={`flex-1 ${
                                        chapterCompleted ? 'text-green-800' : 'text-black'
                                    }`}>
                                        {chapter?.courseData?.chapterName || chapter?.courseData?.[0]?.chapterName}
                                    </span>
                                    {chapterCompleted && (
                                        <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                                    )}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent asChild>
                                <div className={`border-t ${
                                    chapterCompleted ? 'border-green-200 bg-white' : 'border-gray-200 bg-white'
                                }`}>
                                    {(chapter?.courseData?.[0]?.topics || chapter?.courseData?.topics)?.map((topic: any, topicIndex: any) => (
                                        <div
                                            key={topicIndex}
                                            className={`p-3 border-b last:border-0 cursor-pointer transition-colors duration-150 ${
                                                chapterCompleted 
                                                    ? 'hover:bg-green-50' 
                                                    : 'hover:bg-purple-50'
                                            }`}
                                        >
                                            <div className='flex items-center gap-2'>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    chapterCompleted ? 'bg-green-400' : 'bg-purple-400'
                                                }`}></div>
                                                <span className={`text-sm ${
                                                    chapterCompleted ? 'text-green-700' : 'text-gray-700'
                                                }`}>
                                                    {topic?.topic}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    )
}

export default ChapterListSidebar
