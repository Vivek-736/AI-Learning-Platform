import { db } from "@/config/db";
import { assistantContextTable, coursesTable, enrollCourseTable, quizzesTable, flashcardSetsTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { EnrollmentContext, EnrolledCourse } from "@/types/assistant";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class AssistantContextManager {
  async getEnrollmentContext(enrollmentId: number, userEmail: string): Promise<EnrollmentContext | null> {
    try {
      const enrolledCourse = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(
          and(
            eq(enrollCourseTable.id, enrollmentId),
            eq(enrollCourseTable.userEmail, userEmail)
          )
        );

      if (enrolledCourse.length === 0) {
        return null;
      }

      const enrollment = enrolledCourse[0];
      
      const totalChapters = enrollment.courses.noOfChapters || 0;
      const completedChapters = Array.isArray(enrollment.enrollCourse.completedChapters) 
        ? enrollment.enrollCourse.completedChapters 
        : [];
      const progressPercentage = totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100) : 0;

      const userQuizzes = await db
        .select()
        .from(quizzesTable)
        .where(
          and(
            eq(quizzesTable.courseId, enrollment.courses.cid),
            eq(quizzesTable.userEmail, userEmail)
          )
        );

      const userFlashcards = await db
        .select()
        .from(flashcardSetsTable)
        .where(
          and(
            eq(flashcardSetsTable.courseId, enrollment.courses.cid),
            eq(flashcardSetsTable.userEmail, userEmail)
          )
        );
      
      return {
        enrollmentId: enrollment.enrollCourse.id,
        courseId: enrollment.courses.cid,
        courseName: enrollment.courses.name || 'Untitled Course',
        courseDescription: enrollment.courses.description || 'No description available',
        courseContent: enrollment.courses.courseContent || {},
        completedChapters: completedChapters,
        level: enrollment.courses.level,
        category: enrollment.courses.category || 'General',
        enrollmentDate: new Date(),
        progressPercentage,
        userQuizzes,
        userFlashcards
      };
    } catch (error) {
      console.error('Error fetching enrollment context:', error);
      return null;
    }
  }

  async updateEnrollmentContext(enrollmentId: number, contextData: any): Promise<void> {
    try {
      const existingContext = await db
        .select()
        .from(assistantContextTable)
        .where(eq(assistantContextTable.enrollmentId, enrollmentId));

      if (existingContext.length > 0) {
        await db
          .update(assistantContextTable)
          .set({
            contextData,
            updatedAt: new Date()
          })
          .where(eq(assistantContextTable.enrollmentId, enrollmentId));
      } else {
        // Insert new context
        await db
          .insert(assistantContextTable)
          .values({
            enrollmentId,
            contextType: 'enrollment_progress',
            contextData
          });
      }
    } catch (error) {
      console.error('Error updating enrollment context:', error);
      throw new Error('Failed to update enrollment context');
    }
  }

  async getEnrolledCourses(userEmail: string): Promise<EnrolledCourse[]> {
    try {
      const enrolledCourses = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(eq(enrollCourseTable.userEmail, userEmail));

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return enrolledCourses;
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      return [];
    }
  }

  formatEnrollmentForContext(enrollment: EnrolledCourse): EnrollmentContext {
    const totalChapters = enrollment.courses.noOfChapters || 0;
    const completedChapters = enrollment.enrollCourse.completedChapters || [];
    const progressPercentage = totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100) : 0;

    return {
      enrollmentId: enrollment.enrollCourse.id,
      courseId: enrollment.courses.cid,
      courseName: enrollment.courses.name || 'Untitled Course',
      courseDescription: enrollment.courses.description || 'No description available',
      courseContent: enrollment.courses.courseContent || {},
      completedChapters: completedChapters,
      level: enrollment.courses.level,
      category: enrollment.courses.category || 'General',
      enrollmentDate: new Date(),
      progressPercentage
    };
  }

  async getEnrollmentProgress(enrollmentId: number, userEmail: string): Promise<{
    completed: number;
    total: number;
    percentage: number;
    recentActivity: any[];
  } | null> {
    try {
      const context = await this.getEnrollmentContext(enrollmentId, userEmail);
      if (!context) return null;

      const completed = context.completedChapters.length;
      const total = context.courseContent.chapters?.length || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return {
        completed,
        total,
        percentage,
      };
    } catch (error) {
      console.error('Error fetching enrollment progress:', error);
      return null;
    }
  }

  async getPersonalizedInsights(enrollmentId: number, userEmail: string): Promise<{
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  } | null> {
    try {
      const context = await this.getEnrollmentContext(enrollmentId, userEmail);
      if (!context) return null;

      const insights: any = {
        strengths: [],
        improvements: [],
        recommendations: []
      };

      if (context.progressPercentage >= 75) {
        insights.strengths.push('Excellent course completion rate');
      }

      if (context.userQuizzes && context.userQuizzes.length > 0) {
        insights.strengths.push('Active engagement with quizzes');
      }

      if (context.progressPercentage < 25) {
        insights.improvements.push('Consider setting aside more time for learning');
        insights.recommendations.push('Try studying in shorter, more frequent sessions');
      }

      return insights;
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      return null;
    }
  }
}

export const assistantContextManager = new AssistantContextManager();
