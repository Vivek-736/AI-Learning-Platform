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
  TrendingUp,
  Award,
  Target,
  Zap,
  Trophy,
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
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

/* eslint-disable @typescript-eslint/no-explicit-any */
const adminEmails = [
  "vivekvrc777@gmail.com",
  "ashrafgalibshaik@gmail.com",
  "yasodamalavya2006@gmail.com",
  "myvini1411@gmail.com"
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
    codingChallengesCreated: number;
    codingAttemptsCompleted: number;
    averageCodingScore: number;
    totalCodingProblems: number;
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
  totalCodingChallenges: number;
  totalCodingAttempts: number;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const AnalyticsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<UserAnalytics[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const [isRecalculating, setIsRecalculating] = useState(false);

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

  const recalculateAllXp = async () => {
    setIsRecalculating(true);
    try {
      const response = await fetch("/api/xp/recalculate-all", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`Successfully recalculated XP for ${data.updatedCount} users!`);
      } else {
        alert("Failed to recalculate XP");
      }
    } catch (error) {
      console.error("Error recalculating XP:", error);
      alert("Error recalculating XP");
    } finally {
      setIsRecalculating(false);
    }
  };

  const getUserComparisonData = () => {
    return analyticsData.slice(0, 10).map(userData => ({
      name: userData.user.name.split(' ')[0],
      courses: userData.stats.coursesEnrolled,
      quizzes: userData.stats.quizAttempts,
      flashcards: userData.stats.flashcardSets,
      messages: Math.floor(userData.stats.assistantMessages / 10),
    }));
  };

  const getEngagementDistribution = () => {
    if (!platformStats) return [];
    return [
      { name: 'Courses', value: platformStats.totalCourses },
      { name: 'Quizzes', value: platformStats.totalQuizzes },
      { name: 'Flashcards', value: platformStats.totalFlashcardSets },
      { name: 'Interviews', value: platformStats.totalInterviewTemplates },
      { name: 'Coding', value: platformStats.totalCodingChallenges },
      { name: 'AI Chats', value: platformStats.totalAssistantConversations },
    ];
  };

  const getTopPerformers = () => {
    return analyticsData
      .map(userData => ({
        name: userData.user.name,
        score: (userData.stats.averageQuizScore + userData.stats.averageInterviewScore) / 2,
        quizScore: userData.stats.averageQuizScore,
        interviewScore: userData.stats.averageInterviewScore,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  };

  const getActivityTrend = () => {
    return analyticsData.slice(0, 7).map((userData, idx) => ({
      day: `User ${idx + 1}`,
      enrollments: userData.stats.coursesEnrolled,
      quizAttempts: userData.stats.quizAttempts,
      aiMessages: Math.floor(userData.stats.assistantMessages / 10),
    }));
  };

  const getUserRadarData = (userData: UserAnalytics) => {
    return [
      { metric: 'Courses', value: Math.min(userData.stats.coursesEnrolled * 20, 100) },
      { metric: 'Quizzes', value: Math.min(userData.stats.quizAttempts * 10, 100) },
      { metric: 'Flashcards', value: Math.min(userData.stats.flashcardSets * 20, 100) },
      { metric: 'Interviews', value: Math.min(userData.stats.interviewSessionsCompleted * 25, 100) },
      { metric: 'AI Usage', value: Math.min(userData.stats.assistantMessages / 2, 100) },
    ];
  };

  if (!user || !adminEmails.includes(user.primaryEmailAddress?.emailAddress as string)) {
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
    <div className="min-h-screen bg-gray-50 rounded-lg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive platform analytics and user insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={recalculateAllXp}
                disabled={isRecalculating}
                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                {isRecalculating ? "Recalculating..." : "Recalculate All XP"}
              </button>
              <Badge className="bg-gray-100 text-gray-800 px-4 py-2 text-sm border border-gray-200">
                <Zap className="w-4 h-4 mr-2 text-gray-600" />
                Live Analytics
              </Badge>
            </div>
          </div>
        </div>

        {platformStats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{platformStats.totalUsers}</div>
                  <p className="text-xs opacity-80 mt-1">Registered users</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{platformStats.totalCourses}</div>
                  <p className="text-xs opacity-80 mt-1">
                    {platformStats.totalEnrollments} enrollments
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Tools</CardTitle>
                  <Brain className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {platformStats.totalQuizzes + platformStats.totalFlashcardSets}
                  </div>
                  <p className="text-xs opacity-80 mt-1">
                    {platformStats.totalQuizzes} quizzes, {platformStats.totalFlashcardSets} flashcards
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
                  <MessageSquare className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {platformStats.totalAssistantConversations}
                  </div>
                  <p className="text-xs opacity-80 mt-1">Active conversations</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coding Challenges</CardTitle>
                  <Target className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {platformStats.totalCodingChallenges}
                  </div>
                  <p className="text-xs opacity-80 mt-1">
                    {platformStats.totalCodingAttempts} attempts
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    User Activity Comparison
                  </CardTitle>
                  <CardDescription>Top users by engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getUserComparisonData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="courses" fill="#374151" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="quizzes" fill="#4b5563" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="flashcards" fill="#6b7280" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="messages" fill="#9ca3af" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Platform Engagement Distribution
                  </CardTitle>
                  <CardDescription>Content distribution across features</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getEngagementDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getEngagementDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>Users with highest average scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getTopPerformers()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#888" />
                      <YAxis dataKey="name" type="category" width={150} stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="quizScore" fill="#3b82f6" radius={[0, 8, 8, 0]} name="Quiz Score" />
                      <Bar dataKey="interviewScore" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Interview Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Activity Trend
                  </CardTitle>
                  <CardDescription>User engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={getActivityTrend()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="enrollments" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="quizAttempts" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="aiMessages" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">User Analytics</CardTitle>
            <CardDescription>Detailed insights for each user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.map((userData) => (
                <div
                  key={userData.user.id}
                  className="border-2 border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-gray-200 transition-all bg-white"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleUserExpand(userData.user.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xl font-bold text-gray-700">
                          {userData.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{userData.user.name}</h3>
                        <p className="text-sm text-gray-600">{userData.user.email}</p>
                      </div>
                      {userData.user.subscriptionId && (
                        <Badge className="bg-gray-100 text-gray-800 border border-gray-200">
                          ⭐ Premium
                        </Badge>
                      )}
                    </div>
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                      {expandedUsers.has(userData.user.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-5">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">
                        {userData.stats.coursesEnrolled}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">Enrolled</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-700">
                        {userData.stats.averageProgress}%
                      </div>
                      <div className="text-xs text-green-600 font-medium">Avg Progress</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                      <div className="text-2xl font-bold text-indigo-700">
                        {userData.stats.quizAttempts}
                      </div>
                      <div className="text-xs text-indigo-600 font-medium">Quiz Attempts</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                      <div className="text-2xl font-bold text-orange-700">
                        {userData.stats.flashcardSets}
                      </div>
                      <div className="text-xs text-orange-600 font-medium">Flashcard Sets</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200">
                      <div className="text-2xl font-bold text-rose-700">
                        {userData.stats.codingChallengesCreated}
                      </div>
                      <div className="text-xs text-rose-600 font-medium">Coding Challenges</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                      <div className="text-2xl font-bold text-pink-700">
                        {userData.stats.assistantMessages}
                      </div>
                      <div className="text-xs text-pink-600 font-medium">AI Messages</div>
                    </div>
                  </div>

                  {expandedUsers.has(userData.user.id) && (
                    <div className="mt-6 space-y-6">
                      <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-transparent">
                        <CardHeader>
                          <CardTitle className="text-lg">User Activity Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <RadarChart data={getUserRadarData(userData)}>
                              <PolarGrid stroke="#e0e0e0" />
                              <PolarAngleAxis dataKey="metric" stroke="#888" />
                              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#888" />
                              <Radar name="Activity" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Tabs defaultValue="courses" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 bg-indigo-100">
                          <TabsTrigger value="courses" className="data-[state=active]:bg-[#FFFFFF]">Courses</TabsTrigger>
                          <TabsTrigger value="learning" className="data-[state=active]:bg-[#FFFFFF]">Learning</TabsTrigger>
                          <TabsTrigger value="coding" className="data-[state=active]:bg-[#FFFFFF]">Coding</TabsTrigger>
                          <TabsTrigger value="interviews" className="data-[state=active]:bg-[#FFFFFF]">Interviews</TabsTrigger>
                          <TabsTrigger value="assistant" className="data-[state=active]:bg-[#FFFFFF]">AI Assistant</TabsTrigger>
                        </TabsList>

                        <TabsContent value="courses" className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3 text-lg">
                              Created Courses ({userData.stats.coursesCreated})
                            </h4>
                            {userData.details.courses.length > 0 ? (
                              <div className="space-y-2">
                                {userData.details.courses.map((course: any, idx: number) => (
                                  <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-semibold text-gray-900">{course.name}</p>
                                        <p className="text-sm text-gray-600">
                                          {course.chapters} chapters • {course.level}
                                        </p>
                                      </div>
                                      <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                                        {course.category}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No courses created</p>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 text-lg">
                              Enrolled Courses ({userData.stats.coursesEnrolled})
                            </h4>
                            {userData.details.enrollments.length > 0 ? (
                              <div className="space-y-3">
                                {userData.details.enrollments.map((enroll: any, idx: number) => (
                                  <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                    <div className="flex justify-between items-center mb-2">
                                      <p className="font-semibold text-gray-900">{enroll.courseName}</p>
                                      <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                                        {enroll.progress}%
                                      </span>
                                    </div>
                                    <Progress value={enroll.progress} className="h-3 bg-gray-200" />
                                    <p className="text-xs text-gray-600 mt-2 font-medium">
                                      {enroll.completedChapters}/{enroll.totalChapters} chapters completed
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No enrollments</p>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="learning" className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3 text-lg">Quiz Performance</h4>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-center shadow-md">
                                <div className="text-3xl font-bold text-white">{userData.stats.quizzesCreated}</div>
                                <div className="text-sm text-blue-100 font-medium">Created</div>
                              </div>
                              <div className="p-5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-center shadow-md">
                                <div className="text-3xl font-bold text-white">{userData.stats.quizAttempts}</div>
                                <div className="text-sm text-green-100 font-medium">Attempts</div>
                              </div>
                              <div className="p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-center shadow-md">
                                <div className="text-3xl font-bold text-white">{userData.stats.averageQuizScore}%</div>
                                <div className="text-sm text-indigo-100 font-medium">Avg Score</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 text-lg">Flashcards</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-center shadow-md">
                                <div className="text-3xl font-bold text-white">{userData.stats.flashcardSets}</div>
                                <div className="text-sm text-orange-100 font-medium">Sets Created</div>
                              </div>
                              <div className="p-5 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl text-center shadow-md">
                                <div className="text-3xl font-bold text-white">{userData.stats.totalFlashcards}</div>
                                <div className="text-sm text-pink-100 font-medium">Total Cards</div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="coding" className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3 text-lg">Coding Challenge Performance</h4>
                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div className="p-5 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl text-center shadow-md">
                                <div className="text-3xl font-bold text-white">{userData.stats.codingChallengesCreated}</div>
                                <div className="text-sm text-rose-100 font-medium">Created</div>
                              </div>
                              <div className="p-5 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl text-center shadow-md">
                                <div className="text-3xl font-bold text-white">{userData.stats.codingAttemptsCompleted}</div>
                                <div className="text-sm text-pink-100 font-medium">Completed</div>
                              </div>
                              <div className="p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-center shadow-md">
                                <div className="text-3xl font-bold text-white">{userData.stats.averageCodingScore}%</div>
                                <div className="text-sm text-indigo-100 font-medium">Avg Score</div>
                              </div>
                              <div className="p-5 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-center shadow-md">
                                <div className="text-3xl font-bold text-white">{userData.stats.totalCodingProblems}</div>
                                <div className="text-sm text-violet-100 font-medium">Total Problems</div>
                              </div>
                            </div>

                            {userData.details.recentCodingChallenges?.length > 0 && (
                              <div>
                                <h5 className="font-semibold mb-2">Recent Challenges</h5>
                                <div className="space-y-2">
                                  {userData.details.recentCodingChallenges.map((challenge: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-gray-900">{challenge.title}</p>
                                          <p className="text-sm text-gray-600">
                                            {challenge.totalProblems} problems • {challenge.difficulty}
                                          </p>
                                        </div>
                                        <Badge variant="outline" className="border-rose-300 text-rose-700">
                                          {challenge.testType}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {userData.details.recentCodingAttempts?.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-semibold mb-2">Recent Attempts</h5>
                                <div className="space-y-2">
                                  {userData.details.recentCodingAttempts.map((attempt: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
                                      <div className="flex justify-between items-center">
                                        <div className="flex gap-4 text-sm">
                                          <span className="font-semibold text-gray-700">
                                            Score: {attempt.score}
                                          </span>
                                          <span className="text-gray-600">
                                            Solved: {attempt.problemsSolved}/{attempt.problemsAttempted}
                                          </span>
                                          <span className="text-gray-600">
                                            Time: {Math.floor(attempt.timeSpent / 60)}m
                                          </span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                          {new Date(attempt.submittedAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="interviews" className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-center shadow-md">
                              <div className="text-3xl font-bold text-white">
                                {userData.stats.interviewTemplatesCreated}
                              </div>
                              <div className="text-sm text-indigo-100 font-medium">Templates</div>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-center shadow-md">
                              <div className="text-3xl font-bold text-white">
                                {userData.stats.interviewSessionsCompleted}
                              </div>
                              <div className="text-sm text-cyan-100 font-medium">Completed</div>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl text-center shadow-md">
                              <div className="text-3xl font-bold text-white">
                                {userData.stats.averageInterviewScore}%
                              </div>
                              <div className="text-sm text-teal-100 font-medium">Avg Score</div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="assistant" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-center shadow-md">
                              <div className="text-3xl font-bold text-white">
                                {userData.stats.assistantConversations}
                              </div>
                              <div className="text-sm text-violet-100 font-medium">Conversations</div>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-xl text-center shadow-md">
                              <div className="text-3xl font-bold text-white">
                                {userData.stats.assistantMessages}
                              </div>
                              <div className="text-sm text-fuchsia-100 font-medium">Messages</div>
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
