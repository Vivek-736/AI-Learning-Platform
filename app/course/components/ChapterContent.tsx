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
        if (!content) return null;
        
        const codeBlockRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
        const parts = content.split(codeBlockRegex);
        
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                // Code block
                const decodedCode = part
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"');
                
                return (
                    <div key={index} className="my-8">
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
                        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
                            prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-10
                            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-6 prose-h3:leading-tight
                            prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-4 prose-h4:leading-snug
                            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-loose prose-p:mb-6 prose-p:text-base sm:prose-p:text-lg
                            prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-bold
                            prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ul:my-6 prose-ul:space-y-3 prose-ul:pl-6
                            prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-ol:my-6 prose-ol:space-y-3 prose-ol:pl-6
                            prose-li:text-base sm:prose-li:text-lg prose-li:leading-loose prose-li:mb-3 prose-li:pl-2
                            prose-blockquote:border-l-4 prose-blockquote:border-l-gray-900 dark:prose-blockquote:border-l-gray-100 
                            prose-blockquote:bg-gray-100 dark:prose-blockquote:bg-gray-800 prose-blockquote:py-5 prose-blockquote:px-6 
                            prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-base sm:prose-blockquote:text-lg
                            
                            [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:shadow-lg [&_table]:rounded-xl [&_table]:overflow-hidden
                            [&_thead]:bg-gradient-to-r [&_thead]:from-gray-900 [&_thead]:to-gray-800 dark:[&_thead]:from-gray-800 dark:[&_thead]:to-gray-700
                            [&_th]:text-white [&_th]:font-bold [&_th]:text-left [&_th]:py-5 [&_th]:px-6 [&_th]:text-base sm:[&_th]:text-lg [&_th]:border-0
                            [&_tbody]:bg-white dark:[&_tbody]:bg-gray-900 [&_tbody]:divide-y [&_tbody]:divide-gray-200 dark:[&_tbody]:divide-gray-700
                            [&_tr]:transition-colors hover:[&_tbody_tr]:bg-gray-50 dark:hover:[&_tbody_tr]:bg-gray-800
                            [&_td]:py-5 [&_td]:px-6 [&_td]:text-gray-700 dark:[&_td]:text-gray-300 [&_td]:text-base sm:[&_td]:text-lg [&_td]:border-0 [&_td]:leading-relaxed
                            
                            first:[&_h3]:mt-0 first:[&_p]:mt-0"
                    />
                );
            }
        });
    };

    if (!courseContent || courseContent.length === 0) {
        return (
            <div className='flex-1 p-4 sm:p-6 lg:p-10 flex items-center justify-center dark:bg-gray-900'>
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Content Available</h3>
                    <p className="text-gray-600 dark:text-gray-400">This course doesn&apos;t have any content yet.</p>
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
        <div className='flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto h-full'>
            <div className='max-w-5xl container mx-auto p-4 sm:p-6 lg:p-10'>
                {/* Mobile Chapter Selector */}
                <div className='lg:hidden mb-4'>
                    <Select 
                        value={String(selectedChapterIndex)} 
                        onValueChange={(value) => setSelectedChapterIndex(Number(value))}
                    >
                        <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 h-12 text-gray-900 dark:text-gray-100">
                            <SelectValue placeholder="Select Chapter" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            {courseContent?.map((chapter: any, index: number) => {
                                const completed = enrollCourse?.completedChapters?.includes(index) ?? false;
                                return (
                                    <SelectItem key={index} value={String(index)} className="text-gray-900 dark:text-gray-100">
                                        <div className='flex items-center gap-2'>
                                            {completed && <CheckCircle className='w-4 h-4 text-green-600 dark:text-green-500' />}
                                            <span className={completed ? 'text-green-700 dark:text-green-500 font-medium' : ''}>
                                                Chapter {index + 1}: {chapter?.courseData?.chapterName || chapter?.courseData?.[0]?.chapterName}
                                            </span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <div className='mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6'>
                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
                        <div className='flex-1'>
                            <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-gray-100 mb-2'>
                                {courseContent?.[selectedChapterIndex]?.courseData?.chapterName || courseContent?.[selectedChapterIndex]?.courseData?.[0]?.chapterName}
                            </h1>
                            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                                {topics?.length || 0} topics • Chapter {selectedChapterIndex + 1}
                            </p>
                        </div>
                        <Button 
                            onClick={() => markChapterAsCompleted()} 
                            className={`w-full sm:w-auto cursor-pointer transition-all ${isChapterCompleted ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900'}`}
                            disabled={isChapterCompleted}
                            size="lg"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {isChapterCompleted ? 'Completed ✓' : 'Mark as Complete'}
                        </Button>
                    </div>
                </div>
                {videoData && videoData.length > 0 && (
                    <div className='mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8'>
                        <div className='flex items-center gap-2 mb-4 sm:mb-6'>
                            <div className='w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                                <span className='text-lg'>🎬</span>
                            </div>
                            <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
                                Related Video Tutorials
                            </h2>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                            {videoData?.map((video: any, index: any) => index < 2 && (
                                <div key={index} className='bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors'>
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
                                    <h3 className='text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2'>
                                        {video?.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className='space-y-6 sm:space-y-8'>
                    {topics?.map((topic: any, index: any) => (
                        <div key={index} className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
                            <div className='bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 px-4 sm:px-6 py-4 sm:py-5'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-lg'>
                                        {index + 1}
                                    </div>
                                    <h2 className='font-bold text-lg sm:text-xl text-white'>{ topic?.topic}</h2>
                                </div>
                            </div>

                            <div className='p-6 sm:p-8 lg:p-10 space-y-8 bg-white dark:bg-gray-800'>
                                <div className="prose prose-sm sm:prose-base max-w-none">
                                    {processContent(topic?.content)}
                                </div>

                                {topic?.keyTakeaways && topic?.keyTakeaways?.length > 0 && (
                                    <div className='bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-5 sm:p-7 shadow-sm'>
                                        <div className='flex items-center gap-3 mb-5'>
                                            <div className='w-9 h-9 bg-amber-600 dark:bg-amber-700 rounded-lg flex items-center justify-center'>
                                                <Target className='w-5 h-5 text-white' />
                                            </div>
                                            <h3 className='font-bold text-lg sm:text-xl text-amber-900 dark:text-amber-200'>Key Takeaways</h3>
                                        </div>
                                        <ul className='space-y-3 sm:space-y-4'>
                                            {topic.keyTakeaways.map((takeaway: string, idx: number) => (
                                                <li key={idx} className='flex items-start gap-3 sm:gap-4'>
                                                    <CheckCircle className='w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1' />
                                                    <span className='text-base sm:text-lg text-amber-900 dark:text-amber-200 leading-relaxed'>{takeaway}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {topic?.practicalExample && (
                                    <div className='bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-5 sm:p-7 shadow-sm'>
                                        <div className='flex items-center gap-3 mb-5'>
                                            <div className='w-9 h-9 bg-green-600 dark:bg-green-700 rounded-lg flex items-center justify-center'>
                                                <Lightbulb className='w-5 h-5 text-white' />
                                            </div>
                                            <h3 className='font-bold text-lg sm:text-xl text-green-900 dark:text-green-200'>Practical Example</h3>
                                        </div>
                                        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-p:text-green-900 dark:prose-p:text-green-200 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg">
                                            {processContent(topic.practicalExample)}
                                        </div>
                                    </div>
                                )}

                                {topic?.codeSnippet && (
                                    <div className='bg-gray-900 border-2 border-gray-700 rounded-xl overflow-hidden shadow-lg'>
                                        <div className='bg-gray-800 px-5 sm:px-6 py-4 flex items-center gap-3 border-b border-gray-700'>
                                            <div className='w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center'>
                                                <Code className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
                                            </div>
                                            <h3 className='font-bold text-base sm:text-lg text-gray-100'>Code Example</h3>
                                        </div>
                                        <div className='p-5 sm:p-6'>
                                            <SyntaxHighlighter
                                                language="python"
                                                style={atomOneDark}
                                                customStyle={{
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    padding: '20px',
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
                                    <div className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5 sm:p-7 shadow-md'>
                                        <div className='flex items-center gap-3 mb-5'>
                                            <div className='w-9 h-9 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center'>
                                                <BookOpen className='w-5 h-5 text-white' />
                                            </div>
                                            <h3 className='font-bold text-lg sm:text-xl text-blue-900 dark:text-blue-200'>Visual Diagram</h3>
                                        </div>
                                        <div className='bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border-2 border-blue-300 dark:border-blue-700 shadow-inner overflow-x-auto'>
                                            <MermaidDiagram chart={topic.diagram} />
                                        </div>
                                        <p className='text-sm sm:text-base text-blue-700 dark:text-blue-300 mt-4 italic'>
                                            💡 Interactive diagram - zoom and pan as needed
                                        </p>
                                    </div>
                                )}
                                {topic?.quiz && topic?.quiz?.length > 0 && (
                                    <div className='bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-5 sm:p-7 shadow-sm'>
                                        <div className='flex items-center gap-3 mb-5'>
                                            <div className='w-9 h-9 bg-purple-600 dark:bg-purple-700 rounded-lg flex items-center justify-center'>
                                                <Award className='w-5 h-5 text-white' />
                                            </div>
                                            <h3 className='font-bold text-lg sm:text-xl text-purple-900 dark:text-purple-200'>Quick Quiz</h3>
                                        </div>
                                        <div className='space-y-5 sm:space-y-6'>
                                            {topic.quiz.map((q: any, qIdx: number) => (
                                                <div key={qIdx} className='bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-5 border-2 border-purple-200 dark:border-purple-700 shadow-sm'>
                                                    <p className='font-semibold text-base sm:text-lg text-purple-900 dark:text-purple-200 mb-4'>
                                                        Q{qIdx + 1}. {q.question}
                                                    </p>
                                                    <div className='space-y-3'>
                                                        {q.options?.map((option: string, oIdx: number) => (
                                                            <div 
                                                                key={oIdx}
                                                                className={`p-3 sm:p-4 rounded-lg border-2 text-sm sm:text-base transition-all ${
                                                                    oIdx === q.correct 
                                                                        ? 'bg-green-50 dark:bg-green-950/30 border-green-400 dark:border-green-700 text-green-900 dark:text-green-200 font-medium' 
                                                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                                                }`}
                                                            >
                                                                <div className='flex items-center justify-between'>
                                                                    <span>{String.fromCharCode(65 + oIdx)}. {option}</span>
                                                                    {oIdx === q.correct && (
                                                                        <span className='text-green-600 dark:text-green-400 font-bold text-sm'>✓ Correct</span>
                                                                    )}
                                                                </div>
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
