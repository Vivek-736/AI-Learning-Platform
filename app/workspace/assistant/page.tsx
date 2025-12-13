"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Bot, MessageSquare } from "lucide-react";
import ChatInterface from "@/components/assistant/ChatInterface";
import ConversationSidebar from "@/components/assistant/ConversationSidebar";
import CourseSelector from "@/components/assistant/CourseSelector";
import AssistantWelcome from "@/components/assistant/AssistantWelcome";
import { EnrolledCourse } from "@/types/assistant";

export default function AssistantPage() {
  const { user, isLoaded } = useUser();
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<EnrolledCourse | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEnrollmentChange = (enrollment: EnrolledCourse) => {
    setSelectedEnrollment(enrollment);
    setActiveConversationId(null);
  };

  const handleConversationChange = (conversationId: string | null) => {
    setActiveConversationId(conversationId);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[76vh] bg-gray-50 dark:bg-[#101828] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-6 h-6 text-indigo-600 dark:text-gray-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[76vh] bg-gray-50 dark:bg-[#101828] flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Course Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to access your personalized learning assistant
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[76vh] -mt-8 bg-gray-50 dark:bg-[#101828]">
      <div className="bg-white dark:bg-[#101828] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="px-3 sm:px-6">
          <div className="flex items-center justify-between">
            {isMobileView && (
              <button
                title="Toggle Sidebar"
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 lg:hidden transition-colors"
              >
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[83vh]">
        <div
          className={`${
            isMobileView && !showSidebar ? "hidden" : "block"
          } w-full lg:w-80 bg-white dark:bg-[#101828] border-r border-gray-200 dark:border-gray-800 flex flex-col fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto`}
        >
          <CourseSelector
            selectedEnrollment={selectedEnrollment}
            onEnrollmentChange={handleEnrollmentChange}
          />

          {selectedEnrollment && (
            <ConversationSidebar
              enrollmentId={selectedEnrollment.enrollCourse.id}
              activeConversationId={activeConversationId}
              onConversationSelect={handleConversationChange}
              courseName={selectedEnrollment.courses.name || "Course"}
            />
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {selectedEnrollment ? (
            <ChatInterface
              enrollmentId={selectedEnrollment.enrollCourse.id}
              enrolledCourse={selectedEnrollment}
              conversationId={activeConversationId}
              onConversationChange={handleConversationChange}
            />
          ) : (
            <AssistantWelcome />
          )}
        </div>
      </div>

      {isMobileView && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}