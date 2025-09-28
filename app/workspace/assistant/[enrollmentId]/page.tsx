'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Bot, ArrowLeft, MessageSquare } from 'lucide-react';
import ChatInterface from '@/components/assistant/ChatInterface';
import ConversationSidebar from '@/components/assistant/ConversationSidebar';
import { EnrolledCourse } from '@/types/assistant';

export default function EnrollmentAssistantPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const router = useRouter();
  const enrollmentId = parseInt(params.enrollmentId as string);
  
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileView(mobile);
      if (mobile) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      loadEnrollmentData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user, enrollmentId]);

  const loadEnrollmentData = async () => {
    if (isNaN(enrollmentId)) {
      router.push('/workspace/assistant');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/enroll-course');
      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        const targetEnrollment = data.find(
          (enrollment: EnrolledCourse) => enrollment.enrollCourse.id === enrollmentId
        );
        
        if (targetEnrollment) {
          setEnrolledCourse(targetEnrollment);
        } else {
          router.push('/workspace/assistant');
        }
      }
    } catch (error) {
      console.error('Error loading enrollment data:', error);
      router.push('/workspace/assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationChange = (conversationId: string | null) => {
    setActiveConversationId(conversationId);
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-[76vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[76vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Assistant</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your personalized learning assistant</p>
        </div>
      </div>
    );
  }

  if (!enrolledCourse) {
    return (
      <div className="min-h-[76vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Not Found</h1>
          <p className="text-gray-600 mb-6">The requested enrollment could not be found or you don&apos;t have access to it.</p>
          <button
            onClick={() => router.push('/workspace/assistant')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Assistant Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                title="Back to Assistant Dashboard"
                onClick={() => router.push('/workspace/assistant')}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{enrolledCourse.courses.name}</h1>
                <p className="text-sm text-gray-600">
                  AI Assistant • {Math.round((enrolledCourse.enrollCourse.completedChapters?.length || 0) / enrolledCourse.courses.noOfChapters * 100)}% Complete
                </p>
              </div>
            </div>
            
            {isMobileView && (
              <button
                title="Toggle Sidebar"
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 text-gray-600 hover:text-gray-900 lg:hidden"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className={`${
          isMobileView && !showSidebar ? 'hidden' : 'block'
        } w-80 bg-white border-r border-gray-200 flex flex-col`}>
          
          <div className="p-4 border-b border-gray-200 bg-purple-50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-purple-900 truncate">
                  {enrolledCourse.courses.name}
                </h3>
                <p className="text-sm text-purple-700 capitalize">
                  {enrolledCourse.courses.level} • {enrolledCourse.courses.category}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Progress</span>
                <span className="font-medium text-purple-900">
                  {enrolledCourse.enrollCourse.completedChapters?.length || 0} / {enrolledCourse.courses.noOfChapters}
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.round((enrolledCourse.enrollCourse.completedChapters?.length || 0) / enrolledCourse.courses.noOfChapters * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <ConversationSidebar
            enrollmentId={enrolledCourse.enrollCourse.id}
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationChange}
            courseName={enrolledCourse.courses.name || 'Course'}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <ChatInterface
            enrollmentId={enrolledCourse.enrollCourse.id}
            enrolledCourse={enrolledCourse}
            conversationId={activeConversationId}
            onConversationChange={handleConversationChange}
          />
        </div>
      </div>

      {isMobileView && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}