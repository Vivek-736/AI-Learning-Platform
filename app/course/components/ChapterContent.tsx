'use client';

import React, { useContext } from 'react'
import { SelectedChapterIndexContext } from '@/context/selectedChapterIndexContext';
import YouTube from 'react-youtube';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lightbulb, Target, Code, BookOpen, Award } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import MermaidDiagram from '@/components/MermaidDiagram';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('typescript', typescript);

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
                    <div key={index} className="my-6">
                        <SyntaxHighlighter
                            language="javascript"
                            style={atomOneDark}
                            customStyle={{
                                borderRadius: '12px',
                                fontSize: '14px',
                                padding: '20px',
                                border: '1px solid #374151',
                                backgroundColor: '#1f2937',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            showLineNumbers={true}
                            wrapLines={true}
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
                        className="prose prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:border-l-indigo-600 prose-blockquote:bg-indigo-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r prose-table:border-collapse prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-td:border prose-td:border-gray-300"
                    />
                );
            }
        });
    };

    if (!courseContent || courseContent.length === 0) {
        return (
            <div className='flex-1 p-4 sm:p-6 lg:p-10 flex items-center justify-center'>
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
            
            // console.log(result);
            refreshData();
            toast.success('Chapter marked as completed!');
        } catch (error) {
            console.error('Error marking chapter as completed:', error);
            toast.error('Failed to mark chapter as completed. Please try again.');
        }
    }

    const isChapterCompleted = enrollCourse?.completedChapters?.includes(selectedChapterIndex) ?? false;

    return (
        <div className='flex-1 bg-gray-50 overflow-y-auto h-full'>
            <div className='max-w-5xl container mx-auto p-4 sm:p-6 lg:p-10'>
                {/* Mobile Chapter Selector */}
                <div className='lg:hidden mb-4'>
                    <Select 
                        value={String(selectedChapterIndex)} 
                        onValueChange={(value) => setSelectedChapterIndex(Number(value))}
                    >
                        <SelectTrigger className="w-full bg-white border-2 border-indigo-200 h-12">
                            <SelectValue placeholder="Select Chapter" />
                        </SelectTrigger>
                        <SelectContent>
                            {courseContent?.map((chapter: any, index: number) => {
                                const completed = enrollCourse?.completedChapters?.includes(index) ?? false;
                                return (
                                    <SelectItem key={index} value={String(index)}>
                                        <div className='flex items-center gap-2'>
                                            {completed && <CheckCircle className='w-4 h-4 text-green-600' />}
                                            <span className={completed ? 'text-green-700 font-medium' : ''}>
                                                Chapter {index + 1}: {chapter?.courseData?.chapterName || chapter?.courseData?.[0]?.chapterName}
                                            </span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <div className='mb-6 sm:mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6'>
                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
                        <div className='flex-1'>
                            <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-2'>
                                {courseContent?.[selectedChapterIndex]?.courseData?.chapterName || courseContent?.[selectedChapterIndex]?.courseData?.[0]?.chapterName}
                            </h1>
                            <p className='text-sm sm:text-base text-gray-600'>
                                {topics?.length || 0} topics • Chapter {selectedChapterIndex + 1}
                            </p>
                        </div>
                        <Button 
                            onClick={() => markChapterAsCompleted()} 
                            className={`w-full sm:w-auto cursor-pointer transition-all ${isChapterCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            disabled={isChapterCompleted}
                            size="lg"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {isChapterCompleted ? 'Completed ✓' : 'Mark as Complete'}
                        </Button>
                    </div>
                </div>
                {videoData && videoData.length > 0 && (
                    <div className='mb-6 sm:mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8'>
                        <div className='flex items-center gap-2 mb-4 sm:mb-6'>
                            <div className='w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center'>
                                <span className='text-lg'>🎬</span>
                            </div>
                            <h2 className='text-lg sm:text-xl font-bold text-gray-900'>
                                Related Video Tutorials
                            </h2>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                            {videoData?.map((video: any, index: any) => index < 2 && (
                                <div key={index} className='bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 hover:border-indigo-300 transition-colors'>
                                    <div className='aspect-video w-full rounded-lg overflow-hidden mb-3'>
                                        <YouTube
                                            videoId={video?.videoId}
                                            opts={{
                                                height: '100%',
                                                width: '100%',
                                                playerVars: {
                                                    autoplay: 0,
                                                    modestbranding: 1,
                                                    rel: 0,
                                                }
                                            }}
                                            className='w-full h-full'
                                        />
                                    </div>
                                    <h3 className='text-xs sm:text-sm font-medium text-gray-800 line-clamp-2'>
                                        {video?.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className='space-y-6 sm:space-y-8'>
                    {topics?.map((topic: any, index: any) => (
                        <div key={index} className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
                            <div className='bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 sm:px-6 py-4 sm:py-5'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 sm:w-10 sm:h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-lg'>
                                        {index + 1}
                                    </div>
                                    <h2 className='font-bold text-lg sm:text-xl text-white'>{topic?.topic}</h2>
                                </div>
                            </div>

                            <div className='p-4 sm:p-6 lg:p-8 space-y-6'>
                                <div className="prose prose-sm sm:prose-base max-w-none">
                                    {processContent(topic?.content)}
                                </div>

                                {topic?.keyTakeaways && topic?.keyTakeaways?.length > 0 && (
                                    <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6'>
                                        <div className='flex items-center gap-2 mb-3 sm:mb-4'>
                                            <Target className='w-5 h-5 text-amber-600' />
                                            <h3 className='font-bold text-base sm:text-lg text-amber-900'>Key Takeaways</h3>
                                        </div>
                                        <ul className='space-y-2 sm:space-y-3'>
                                            {topic.keyTakeaways.map((takeaway: string, idx: number) => (
                                                <li key={idx} className='flex items-start gap-2 sm:gap-3'>
                                                    <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5' />
                                                    <span className='text-sm sm:text-base text-amber-900'>{takeaway}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {topic?.practicalExample && (
                                    <div className='bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6'>
                                        <div className='flex items-center gap-2 mb-3 sm:mb-4'>
                                            <Lightbulb className='w-5 h-5 text-green-600' />
                                            <h3 className='font-bold text-base sm:text-lg text-green-900'>Practical Example</h3>
                                        </div>
                                        <div className="prose prose-sm sm:prose-base max-w-none prose-p:text-green-900">
                                            {processContent(topic.practicalExample)}
                                        </div>
                                    </div>
                                )}

                                {topic?.codeSnippet && (
                                    <div className='bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg'>
                                        <div className='bg-gray-800 px-4 sm:px-6 py-3 flex items-center gap-2 border-b border-gray-700'>
                                            <Code className='w-4 h-4 sm:w-5 sm:h-5 text-green-400' />
                                            <h3 className='font-bold text-sm sm:text-base text-gray-100'>Code Example</h3>
                                        </div>
                                        <div className='p-4 sm:p-5'>
                                            <SyntaxHighlighter
                                                language="python"
                                                style={atomOneDark}
                                                customStyle={{
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    padding: '16px',
                                                    margin: 0,
                                                    backgroundColor: '#1f2937',
                                                    border: 'none'
                                                }}
                                                showLineNumbers={true}
                                                wrapLines={true}
                                                wrapLongLines={true}
                                            >
                                                {typeof topic.codeSnippet === 'string' 
                                                    ? topic.codeSnippet.replace(/<\/?pre>|<\/?code>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
                                                    : topic.codeSnippet
                                                }
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>
                                )}

                                {topic?.diagram && (
                                    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 shadow-md'>
                                        <div className='flex items-center gap-2 mb-4 sm:mb-5'>
                                            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                                                <BookOpen className='w-5 h-5 text-white' />
                                            </div>
                                            <h3 className='font-bold text-lg sm:text-xl text-blue-900'>Visual Diagram</h3>
                                        </div>
                                        <div className='bg-white rounded-xl p-2 sm:p-4 border-2 border-blue-300 shadow-inner overflow-x-auto'>
                                            <MermaidDiagram chart={topic.diagram} />
                                        </div>
                                        <p className='text-xs sm:text-sm text-blue-700 mt-3 italic'>
                                            💡 Interactive diagram - zoom and pan as needed
                                        </p>
                                    </div>
                                )}
                                {topic?.quiz && topic?.quiz?.length > 0 && (
                                    <div className='bg-indigo-50 border border-indigo-200 rounded-xl p-4 sm:p-6'>
                                        <div className='flex items-center gap-2 mb-4 sm:mb-6'>
                                            <Award className='w-5 h-5 text-indigo-600' />
                                            <h3 className='font-bold text-base sm:text-lg text-indigo-900'>Quick Quiz</h3>
                                        </div>
                                        <div className='space-y-4 sm:space-y-6'>
                                            {topic.quiz.map((q: any, qIdx: number) => (
                                                <div key={qIdx} className='bg-white rounded-lg p-3 sm:p-4 border border-indigo-200'>
                                                    <p className='font-semibold text-sm sm:text-base text-indigo-900 mb-3'>
                                                        Q{qIdx + 1}. {q.question}
                                                    </p>
                                                    <div className='space-y-2'>
                                                        {q.options?.map((option: string, oIdx: number) => (
                                                            <div 
                                                                key={oIdx}
                                                                className={`p-2 sm:p-3 rounded-lg border text-sm sm:text-base ${
                                                                    oIdx === q.correct 
                                                                        ? 'bg-green-50 border-green-300 text-green-900' 
                                                                        : 'bg-gray-50 border-gray-200 text-gray-700'
                                                                }`}
                                                            >
                                                                {String.fromCharCode(65 + oIdx)}. {option}
                                                                {oIdx === q.correct && (
                                                                    <span className='ml-2 text-green-600 font-semibold'>✓ Correct</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChapterContent
