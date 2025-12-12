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
        <div className='w-full lg:w-80 bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-800 h-full'>
            <div className='p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900'>
                <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Course Content</h2>
                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                    {courseContent?.length} {courseContent?.length === 1 ? 'Chapter' : 'Chapters'}
                </p>
                <div className='mt-2 sm:mt-3'>
                    <div className='flex items-center gap-2'>
                        <div className='flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden'>
                            <div 
                                className='bg-green-500 dark:bg-green-600 h-full rounded-full transition-all duration-500'
                                style={{ width: `${courseContent?.length > 0 ? ((completedChapters?.length || 0) / courseContent.length * 100) : 0}%` }}
                            />
                        </div>
                        <span className='text-xs sm:text-sm font-semibold text-green-600 dark:text-green-500 whitespace-nowrap'>
                            {completedChapters?.length || 0}/{courseContent?.length || 0}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className='flex-1 overflow-y-auto p-3 sm:p-5 bg-white dark:bg-gray-900'>
                <Accordion type='single' collapsible className='space-y-2 sm:space-y-3'>
                {courseContent?.map((chapter: any, index: React.Key | null | undefined) => {
                    const chapterCompleted = isChapterCompleted(Number(index));
                    const isSelected = selectedChapterIndex === index;
                    
                    return (
                        <AccordionItem
                            value={chapter?.courseData?.chapterName || chapter?.courseData?.[0]?.chapterName}
                            key={index}
                            className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                                chapterCompleted 
                                    ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 shadow-sm' 
                                    : isSelected 
                                        ? 'border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 shadow-md' 
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                            }`}
                            onClick={() => setSelectedChapterIndex(index)}
                        >
                            <AccordionTrigger className={`font-medium text-sm sm:text-base px-3 sm:px-4 py-3 sm:py-4 text-left transition-colors duration-200 ${
                                chapterCompleted 
                                    ? 'hover:bg-green-100 dark:hover:bg-green-950/50' 
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}>
                                <div className='flex items-center gap-2 sm:gap-3 w-full pr-2'>
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 shadow-sm ${
                                        chapterCompleted 
                                            ? 'bg-green-600 dark:bg-green-700 text-white' 
                                            : isSelected
                                                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                                                : 'bg-gray-700 dark:bg-gray-600 text-white'
                                    }`}>
                                        {chapterCompleted ? (
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        ) : (
                                            Number(index) + 1
                                        )}
                                    </div>
                                    <span className={`flex-1 text-left leading-tight ${
                                        chapterCompleted ? 'text-green-900 dark:text-green-200' : isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900 dark:text-gray-200'
                                    }`}>
                                        {chapter?.courseData?.chapterName || chapter?.courseData?.[0]?.chapterName}
                                    </span>
                                    {chapterCompleted && (
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                                    )}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent asChild>
                                <div className={`border-t ${
                                    chapterCompleted ? 'border-green-200 dark:border-green-800 bg-white dark:bg-gray-900' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                                }`}>
                                    {(chapter?.courseData?.[0]?.topics || chapter?.courseData?.topics)?.map((topic: any, topicIndex: any) => (
                                        <div
                                            key={topicIndex}
                                            className={`p-2 sm:p-3 border-b last:border-0 cursor-pointer transition-colors duration-150 ${
                                                chapterCompleted 
                                                    ? 'hover:bg-green-50 dark:hover:bg-green-950/30' 
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <div className='flex items-center gap-2'>
                                                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                                                    chapterCompleted ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-700 dark:bg-gray-500'
                                                }`}></div>
                                                <span className={`text-xs sm:text-sm leading-tight ${
                                                    chapterCompleted ? 'text-green-800 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
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
        </div>
    )
}

export default ChapterListSidebar
