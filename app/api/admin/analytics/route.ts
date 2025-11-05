import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  usersTable,
  coursesTable,
  enrollCourseTable,
  quizzesTable,
  quizAttemptsTable,
  flashcardSetsTable,
  interviewTemplatesTable,
  interviewSessionsTable,
  assistantConversationsTable,
  assistantMessagesTable,
  codingChallengesTable,
  codingAttemptsTable,
} from "@/config/schema";
import { eq, count } from "drizzle-orm";

const adminEmails = [
  "vivekvrc777@gmail.com",
  "ashrafgalibshaik@gmail.com",
  "yasodamalavya2006@gmail.com",
];

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (
      !user?.primaryEmailAddress?.emailAddress ||
      !adminEmails.includes(user.primaryEmailAddress.emailAddress)
    ) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const users = await db.select().from(usersTable);

    const userAnalytics = await Promise.all(
      users.map(async (userData) => {
        const userEmail = userData.email;

        const coursesCreated = await db
          .select()
          .from(coursesTable)
          .where(eq(coursesTable.userEmail, userEmail));

        const enrollments = await db
          .select({
            enrollment: enrollCourseTable,
            course: coursesTable,
          })
          .from(enrollCourseTable)
          .innerJoin(coursesTable, eq(coursesTable.cid, enrollCourseTable.cid))
          .where(eq(enrollCourseTable.userEmail, userEmail));

        const totalProgress = enrollments.reduce((acc, enroll) => {
          const completed = Array.isArray(enroll.enrollment.completedChapters)
            ? enroll.enrollment.completedChapters.length
            : 0;
          const total = enroll.course.noOfChapters || 1;
          return acc + (completed / total) * 100;
        }, 0);
        const avgProgress =
          enrollments.length > 0 ? totalProgress / enrollments.length : 0;

        const quizzesCreated = await db
          .select()
          .from(quizzesTable)
          .where(eq(quizzesTable.userEmail, userEmail));

        const quizAttempts = await db
          .select()
          .from(quizAttemptsTable)
          .where(eq(quizAttemptsTable.userEmail, userEmail));

        const avgQuizScore =
          quizAttempts.length > 0
            ? quizAttempts.reduce(
                (acc, attempt) => acc + attempt.percentage,
                0
              ) / quizAttempts.length
            : 0;

        const flashcardSets = await db
          .select()
          .from(flashcardSetsTable)
          .where(eq(flashcardSetsTable.userEmail, userEmail));

        const interviewTemplates = await db
          .select()
          .from(interviewTemplatesTable)
          .where(eq(interviewTemplatesTable.creatorEmail, userEmail));

        const interviewSessions = await db
          .select()
          .from(interviewSessionsTable)
          .where(eq(interviewSessionsTable.candidateEmail, userEmail));

        const completedInterviews = interviewSessions.filter(
          (s) => s.status === "completed"
        );
        const avgInterviewScore =
          completedInterviews.length > 0
            ? completedInterviews.reduce(
                (acc, session) => acc + (session.overallScore || 0),
                0
              ) / completedInterviews.length
            : 0;

        const assistantConversations = await db
          .select()
          .from(assistantConversationsTable)
          .where(eq(assistantConversationsTable.userEmail, userEmail));

        const assistantMessagesCount = await db
          .select({ count: count() })
          .from(assistantMessagesTable)
          .innerJoin(
            assistantConversationsTable,
            eq(
              assistantMessagesTable.conversationId,
              assistantConversationsTable.conversationId
            )
          )
          .where(eq(assistantConversationsTable.userEmail, userEmail));

        const codingChallenges = await db
          .select()
          .from(codingChallengesTable)
          .where(eq(codingChallengesTable.userEmail, userEmail));

        const codingAttempts = await db
          .select()
          .from(codingAttemptsTable)
          .where(eq(codingAttemptsTable.userEmail, userEmail));

        const completedCodingAttempts = codingAttempts.filter(
          (a) => a.status === "completed"
        );

        const avgCodingScore =
          completedCodingAttempts.length > 0
            ? completedCodingAttempts.reduce(
                (acc, attempt) => acc + (attempt.totalScore || 0),
                0
              ) / completedCodingAttempts.length
            : 0;

        return {
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            subscriptionId: userData.subscriptionId,
          },
          stats: {
            coursesCreated: coursesCreated.length,
            coursesEnrolled: enrollments.length,
            averageProgress: Math.round(avgProgress),
            quizzesCreated: quizzesCreated.length,
            quizAttempts: quizAttempts.length,
            averageQuizScore: Math.round(avgQuizScore),
            flashcardSets: flashcardSets.length,
            totalFlashcards: flashcardSets.reduce(
              (acc, set) => acc + set.totalCards,
              0
            ),
            interviewTemplatesCreated: interviewTemplates.length,
            interviewSessionsCompleted: completedInterviews.length,
            averageInterviewScore: Math.round(avgInterviewScore),
            assistantConversations: assistantConversations.length,
            assistantMessages: assistantMessagesCount[0]?.count || 0,
            codingChallengesCreated: codingChallenges.length,
            codingAttemptsCompleted: completedCodingAttempts.length,
            averageCodingScore: Math.round(avgCodingScore),
            totalCodingProblems: codingChallenges.reduce(
              (acc, challenge) => acc + (challenge.totalProblems || 0),
              0
            ),
          },
          details: {
            courses: coursesCreated.map((c) => ({
              id: c.id,
              name: c.name,
              level: c.level,
              category: c.category,
              chapters: c.noOfChapters,
            })),
            enrollments: enrollments.map((e) => ({
              courseName: e.course.name,
              progress: Math.round(
                ((Array.isArray(e.enrollment.completedChapters)
                  ? e.enrollment.completedChapters.length
                  : 0) /
                  e.course.noOfChapters) *
                  100
              ),
              completedChapters: Array.isArray(e.enrollment.completedChapters)
                ? e.enrollment.completedChapters.length
                : 0,
              totalChapters: e.course.noOfChapters,
            })),
            recentQuizzes: quizzesCreated.slice(0, 5).map((q) => ({
              title: q.title,
              difficulty: q.difficulty,
              totalQuestions: q.totalQuestions,
            })),
            recentQuizAttempts: quizAttempts.slice(0, 5).map((a) => ({
              score: a.score,
              percentage: a.percentage,
              completedAt: a.completedAt,
            })),
            interviewSessions: completedInterviews.slice(0, 5).map((s) => ({
              candidateName: s.candidateName,
              score: s.overallScore,
              completedAt: s.completedAt,
              duration: s.duration,
            })),
            recentCodingChallenges: codingChallenges.slice(0, 5).map((c) => ({
              title: c.title,
              difficulty: c.difficulty,
              topic: c.topic,
              totalProblems: c.totalProblems,
              testType: c.testType,
            })),
            recentCodingAttempts: completedCodingAttempts.slice(0, 5).map((a) => ({
              score: a.totalScore,
              problemsSolved: a.problemsSolved,
              problemsAttempted: a.problemsAttempted,
              timeSpent: a.timeSpent,
              submittedAt: a.submittedAt,
            })),
          },
        };
      })
    );

    const platformStats = {
      totalUsers: users.length,
      totalCourses: await db.select({ count: count() }).from(coursesTable),
      totalEnrollments: await db
        .select({ count: count() })
        .from(enrollCourseTable),
      totalQuizzes: await db.select({ count: count() }).from(quizzesTable),
      totalFlashcardSets: await db
        .select({ count: count() })
        .from(flashcardSetsTable),
      totalInterviewTemplates: await db
        .select({ count: count() })
        .from(interviewTemplatesTable),
      totalAssistantConversations: await db
        .select({ count: count() })
        .from(assistantConversationsTable),
      totalCodingChallenges: await db
        .select({ count: count() })
        .from(codingChallengesTable),
      totalCodingAttempts: await db
        .select({ count: count() })
        .from(codingAttemptsTable),
    };

    return NextResponse.json({
      success: true,
      userAnalytics,
      platformStats: {
        totalUsers: platformStats.totalUsers,
        totalCourses: platformStats.totalCourses[0].count,
        totalEnrollments: platformStats.totalEnrollments[0].count,
        totalQuizzes: platformStats.totalQuizzes[0].count,
        totalFlashcardSets: platformStats.totalFlashcardSets[0].count,
        totalInterviewTemplates: platformStats.totalInterviewTemplates[0].count,
        totalAssistantConversations: platformStats.totalAssistantConversations[0].count,
        totalCodingChallenges: platformStats.totalCodingChallenges[0].count,
        totalCodingAttempts: platformStats.totalCodingAttempts[0].count,
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}