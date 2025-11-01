import { db } from "@/config/db";
import { 
    userXpTable, 
    usersTable,
    enrollCourseTable, 
    quizAttemptsTable, 
    flashcardSetsTable,
    interviewSessionsTable,
    coursesTable
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const allUsers = await db.select().from(usersTable);

        let updatedCount = 0;
        const results = [];

        for (const user of allUsers) {
            const userEmail = user.email;

            const enrolledCourses = await db
                .select({
                    completedChapters: enrollCourseTable.completedChapters,
                    courseId: enrollCourseTable.cid,
                    noOfChapters: coursesTable.noOfChapters
                })
                .from(enrollCourseTable)
                .innerJoin(coursesTable, eq(enrollCourseTable.cid, coursesTable.cid))
                .where(eq(enrollCourseTable.userEmail, userEmail));

            let courseCompletionXp = 0;
            enrolledCourses.forEach((course) => {
                const completedChapters = Array.isArray(course.completedChapters) 
                    ? course.completedChapters.length 
                    : 0;
                const totalChapters = course.noOfChapters || 1;
                const completionPercentage = (completedChapters / totalChapters) * 100;
                courseCompletionXp += Math.round(completionPercentage);
            });

            const quizAttempts = await db
                .select({
                    percentage: quizAttemptsTable.percentage
                })
                .from(quizAttemptsTable)
                .where(eq(quizAttemptsTable.userEmail, userEmail));

            const quizXp = quizAttempts.reduce((total, attempt) => {
                return total + (attempt.percentage || 0);
            }, 0);

            const interviewSessions = await db
                .select({
                    overallScore: interviewSessionsTable.overallScore
                })
                .from(interviewSessionsTable)
                .where(eq(interviewSessionsTable.candidateEmail, userEmail));

            const interviewXp = interviewSessions.reduce((total, session) => {
                return total + (session.overallScore || 0);
            }, 0);

            const flashcardSets = await db
                .select({
                    totalCards: flashcardSetsTable.totalCards
                })
                .from(flashcardSetsTable)
                .where(eq(flashcardSetsTable.userEmail, userEmail));

            const flashcardXp = flashcardSets.reduce((total, set) => {
                return total + (set.totalCards || 0);
            }, 0);

            const totalXp = courseCompletionXp + quizXp + interviewXp + flashcardXp;

            const existingXp = await db
                .select()
                .from(userXpTable)
                .where(eq(userXpTable.userEmail, userEmail))
                .limit(1);

            if (existingXp.length > 0) {
                await db
                    .update(userXpTable)
                    .set({
                        totalXp,
                        courseCompletionXp,
                        quizXp,
                        interviewXp,
                        flashcardXp,
                        lastUpdated: new Date()
                    })
                    .where(eq(userXpTable.userEmail, userEmail));
            } else {
                await db.insert(userXpTable).values({
                    userEmail,
                    totalXp,
                    courseCompletionXp,
                    quizXp,
                    interviewXp,
                    flashcardXp
                });
            }

            updatedCount++;
            results.push({
                email: userEmail,
                totalXp,
                courseCompletionXp,
                quizXp,
                interviewXp,
                flashcardXp
            });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully recalculated XP for ${updatedCount} users`,
            updatedCount,
            results
        });

    } catch (error) {
        console.error("Error recalculating XP for all users:", error);
        return NextResponse.json({ error: "Failed to recalculate XP" }, { status: 500 });
    }
}