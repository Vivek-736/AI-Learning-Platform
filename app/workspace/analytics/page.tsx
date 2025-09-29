"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  Brain,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

/* eslint-disable @typescript-eslint/no-explicit-any */
const adminEmails = [
  "asishpraneethnamala@gmail.com",
  "vivekvrc777@gmail.com",
  "ashrafgalibshaik@gmail.com",
  "yasodamalavya2006@gmail.com",
  "myvini1411@gmail.com",
  "chakkaharshitha98@gmail.com",
];

interface UserAnalytics {
  user: {
    id: number;
    name: string;
    email: string;
    subscriptionId: string | null;
  };
  stats: {
    coursesCreated: number;
    coursesEnrolled: number;
    averageProgress: number;
    quizzesCreated: number;
    quizAttempts: number;
    averageQuizScore: number;
    flashcardSets: number;
    totalFlashcards: number;
    interviewTemplatesCreated: number;
    interviewSessionsCompleted: number;
    averageInterviewScore: number;
    assistantConversations: number;
    assistantMessages: number;
  };
  details: any;
}

interface PlatformStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalQuizzes: number;
  totalFlashcardSets: number;
  totalInterviewTemplates: number;
  totalAssistantConversations: number;
}

const AnalyticsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<UserAnalytics[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (
      user &&
      !adminEmails.includes(user.primaryEmailAddress?.emailAddress as string)
    ) {
      router.push("/workspace");
    }
  }, [user, router]);

  useEffect(() => {
    if (
      user &&
      adminEmails.includes(user.primaryEmailAddress?.emailAddress as string)
    ) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.userAnalytics);
        setPlatformStats(data.platformStats);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserExpand = (userId: number) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  if (
    !user ||
    !adminEmails.includes(user.primaryEmailAddress?.emailAddress as string)
  ) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive platform analytics and user insights
          </p>
        </div>

        {platformStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platformStats.totalUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platformStats.totalCourses}
                </div>
                <p className="text-xs text-muted-foreground">
                  {platformStats.totalEnrollments} enrollments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Learning Tools
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platformStats.totalQuizzes +
                    platformStats.totalFlashcardSets}
                </div>
                <p className="text-xs text-muted-foreground">
                  {platformStats.totalQuizzes} quizzes,{" "}
                  {platformStats.totalFlashcardSets} flashcards
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  AI Assistant
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platformStats.totalAssistantConversations}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active conversations
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
            <CardDescription>Detailed insights for each user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.map((userData) => (
                <div
                  key={userData.user.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleUserExpand(userData.user.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-purple-700">
                          {userData.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {userData.user.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {userData.user.email}
                        </p>
                      </div>
                      {userData.user.subscriptionId && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      {expandedUsers.has(userData.user.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">
                        {userData.stats.coursesEnrolled}
                      </div>
                      <div className="text-xs text-blue-600">Enrolled</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        {userData.stats.averageProgress}%
                      </div>
                      <div className="text-xs text-green-600">Avg Progress</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">
                        {userData.stats.quizAttempts}
                      </div>
                      <div className="text-xs text-purple-600">
                        Quiz Attempts
                      </div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-700">
                        {userData.stats.flashcardSets}
                      </div>
                      <div className="text-xs text-orange-600">
                        Flashcard Sets
                      </div>
                    </div>
                    <div className="text-center p-3 bg-pink-50 rounded-lg">
                      <div className="text-2xl font-bold text-pink-700">
                        {userData.stats.assistantMessages}
                      </div>
                      <div className="text-xs text-pink-600">AI Messages</div>
                    </div>
                  </div>

                  {expandedUsers.has(userData.user.id) && (
                    <div className="mt-6 space-y-6">
                      <Tabs defaultValue="courses" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="courses">Courses</TabsTrigger>
                          <TabsTrigger value="learning">Learning</TabsTrigger>
                          <TabsTrigger value="interviews">
                            Interviews
                          </TabsTrigger>
                          <TabsTrigger value="assistant">
                            AI Assistant
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="courses" className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Created Courses ({userData.stats.coursesCreated})
                            </h4>
                            {userData.details.courses.length > 0 ? (
                              <div className="space-y-2">
                                {userData.details.courses.map(
                                  (course: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="font-medium">
                                            {course.name}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {course.chapters} chapters •{" "}
                                            {course.level}
                                          </p>
                                        </div>
                                        <Badge variant="outline">
                                          {course.category}
                                        </Badge>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No courses created
                              </p>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              Enrolled Courses ({userData.stats.coursesEnrolled}
                              )
                            </h4>
                            {userData.details.enrollments.length > 0 ? (
                              <div className="space-y-2">
                                {userData.details.enrollments.map(
                                  (enroll: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <p className="font-medium">
                                          {enroll.courseName}
                                        </p>
                                        <span className="text-sm font-semibold text-purple-600">
                                          {enroll.progress}%
                                        </span>
                                      </div>
                                      <Progress
                                        value={enroll.progress}
                                        className="h-2"
                                      />
                                      <p className="text-xs text-gray-600 mt-1">
                                        {enroll.completedChapters}/
                                        {enroll.totalChapters} chapters
                                        completed
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No enrollments
                              </p>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="learning" className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Quiz Performance
                            </h4>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="p-4 bg-blue-50 rounded-lg text-center">
                                <div className="text-3xl font-bold text-blue-700">
                                  {userData.stats.quizzesCreated}
                                </div>
                                <div className="text-sm text-blue-600">
                                  Created
                                </div>
                              </div>
                              <div className="p-4 bg-green-50 rounded-lg text-center">
                                <div className="text-3xl font-bold text-green-700">
                                  {userData.stats.quizAttempts}
                                </div>
                                <div className="text-sm text-green-600">
                                  Attempts
                                </div>
                              </div>
                              <div className="p-4 bg-purple-50 rounded-lg text-center">
                                <div className="text-3xl font-bold text-purple-700">
                                  {userData.stats.averageQuizScore}%
                                </div>
                                <div className="text-sm text-purple-600">
                                  Avg Score
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Flashcards</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-orange-50 rounded-lg text-center">
                                <div className="text-3xl font-bold text-orange-700">
                                  {userData.stats.flashcardSets}
                                </div>
                                <div className="text-sm text-orange-600">
                                  Sets Created
                                </div>
                              </div>
                              <div className="p-4 bg-pink-50 rounded-lg text-center">
                                <div className="text-3xl font-bold text-pink-700">
                                  {userData.stats.totalFlashcards}
                                </div>
                                <div className="text-sm text-pink-600">
                                  Total Cards
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="interviews" className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-indigo-50 rounded-lg text-center">
                              <div className="text-3xl font-bold text-indigo-700">
                                {userData.stats.interviewTemplatesCreated}
                              </div>
                              <div className="text-sm text-indigo-600">
                                Templates
                              </div>
                            </div>
                            <div className="p-4 bg-cyan-50 rounded-lg text-center">
                              <div className="text-3xl font-bold text-cyan-700">
                                {userData.stats.interviewSessionsCompleted}
                              </div>
                              <div className="text-sm text-cyan-600">
                                Completed
                              </div>
                            </div>
                            <div className="p-4 bg-teal-50 rounded-lg text-center">
                              <div className="text-3xl font-bold text-teal-700">
                                {userData.stats.averageInterviewScore}%
                              </div>
                              <div className="text-sm text-teal-600">
                                Avg Score
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="assistant" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-violet-50 rounded-lg text-center">
                              <div className="text-3xl font-bold text-violet-700">
                                {userData.stats.assistantConversations}
                              </div>
                              <div className="text-sm text-violet-600">
                                Conversations
                              </div>
                            </div>
                            <div className="p-4 bg-fuchsia-50 rounded-lg text-center">
                              <div className="text-3xl font-bold text-fuchsia-700">
                                {userData.stats.assistantMessages}
                              </div>
                              <div className="text-sm text-fuchsia-600">
                                Messages
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
