'use client';

import React, { useContext } from 'react'
import { SelectedChapterIndexContext } from '@/context/selectedChapterIndexContext';
import YouTube from 'react-youtube';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('swift', swift);

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
interface ChapterContentProps {
    courseInfo: any;
    refreshData: () => void;
}

const ChapterContent = ({ courseInfo, refreshData }: ChapterContentProps) => {
    const { courseId } = useParams();
    const { course, enrollCourse } = courseInfo;
    const courseContent = courseInfo?.courses?.courseContent;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
    const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo
    const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics

    const processContent = (content: string) => {
        const codeBlockRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
        const parts = content.split(codeBlockRegex);
        
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                const decodedCode = part
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"');
                
                return (
                    <div key={index} className="my-4">
                        <SyntaxHighlighter
                            language="javascript"
                            style={github}
                            customStyle={{
                                borderRadius: '8px',
                                fontSize: '14px',
                                padding: '16px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: '#f9fafb'
                            }}
                        >
                            {decodedCode}
                        </SyntaxHighlighter>
                    </div>
                );
            } else {
                return (
                    <div 
                        key={index} 
                        dangerouslySetInnerHTML={{ __html: part }}
                        className="prose prose-sm max-w-none"
                    />
                );
            }
        });
    };

    if (!courseContent || courseContent.length === 0) {
        return (
            <div className='flex-1 p-5 lg:p-10 flex items-center justify-center'>
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
                    <p className="text-gray-600">This course doesn&apos;t have any content yet.</p>
                </div>
            </div>
        );
    }

    const markChapterAsCompleted = async () => {
        try {
            const completedChapter = enrollCourse?.completedChapters ?? [];
            
            if (completedChapter.includes(selectedChapterIndex)) {
                toast.info('Chapter already marked as completed!');
                return;
            }
            
            completedChapter.push(selectedChapterIndex);
            
            const result = await axios.put('/api/enroll-course', {
                completedChapter: completedChapter,
                courseId: courseId
            });
            
            console.log(result);
            refreshData();
            toast.success('Chapter marked as completed!');
        } catch (error) {
            console.error('Error marking chapter as completed:', error);
            toast.error('Failed to mark chapter as completed. Please try again.');
        }
    }

    const isChapterCompleted = enrollCourse?.completedChapters?.includes(selectedChapterIndex) ?? false;

    return (
        <div className='flex-1 p-5 lg:p-10 bg-white overflow-y-auto 2xl:ml-60'>
            <div className='max-w-4xl'>
                <div className='mb-8'>
                    <div className='flex justify-between items-center'>
                        <h1 className='font-bold text-2xl lg:text-3xl text-black mb-4'>
                            {courseContent?.[selectedChapterIndex]?.courseData?.chapterName || courseContent?.[selectedChapterIndex]?.courseData?.[0]?.chapterName}
                        </h1>
                        <Button 
                            onClick={() => markChapterAsCompleted()} 
                            className={`cursor-pointer ${isChapterCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            disabled={isChapterCompleted}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {isChapterCompleted ? 'Completed' : 'Mark as completed'}
                        </Button>
                    </div>
                    
                    {videoData && videoData.length > 0 && (
                        <div className='mb-8'>
                            <h2 className='text-lg font-semibold text-black mb-4 flex items-center gap-2'>
                                <span className='text-purple-600'>🎬</span>
                                Related Videos
                            </h2>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {videoData?.map((video: any, index: any) => index < 2 && (
                                    <div key={index} className='bg-gray-50 rounded-lg p-4'>
                                        <YouTube
                                            videoId={video?.videoId}
                                            opts={{
                                                height: '200',
                                                width: '100%',
                                            }}
                                            className='w-full'
                                        />
                                        <h3 className='text-sm font-medium text-gray-800 mt-2 line-clamp-2'>
                                            {video?.title}
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className='space-y-6'>
                    {topics?.map((topic: any, index: any) => (
                        <div key={index} className='bg-secondary rounded-xl border border-gray-200 overflow-hidden'>
                            <div className='bg-white px-6 py-4 border-b border-gray-200'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                                        {index + 1}
                                    </div>
                                    <h2 className='font-bold text-lg text-black'>{topic?.topic}</h2>
                                </div>
                            </div>
                            <div className='p-6 bg-white'>
                                <div className="prose prose-sm max-w-none text-gray-700">
                                    {processContent(topic?.content)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChapterContent
