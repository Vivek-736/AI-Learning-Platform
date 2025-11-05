import { db } from "@/config/db";
import { 
    userXpTable, 
    enrollCourseTable, 
    quizAttemptsTable, 
    flashcardSetsTable,
    interviewSessionsTable,
    coursesTable,
    codingAttemptsTable
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userEmail } = await req.json();

        if (!userEmail) {
            return NextResponse.json({ error: "User email is required" }, { status: 400 });
        }

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

        const codingAttempts = await db
            .select({
                totalScore: codingAttemptsTable.totalScore,
                problemsAttempted: codingAttemptsTable.problemsAttempted
            })
            .from(codingAttemptsTable)
            .where(eq(codingAttemptsTable.userEmail, userEmail));

        const codingXp = codingAttempts.reduce((total, attempt) => {
            const percentage = attempt.problemsAttempted && attempt.problemsAttempted > 0
                ? (attempt.totalScore || 0) / attempt.problemsAttempted
                : (attempt.totalScore || 0);
            return total + Math.round(percentage);
        }, 0);

        const totalXp = courseCompletionXp + quizXp + interviewXp + flashcardXp + codingXp;

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
                    codingXp,
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
                flashcardXp,
                codingXp
            });
        }

        return NextResponse.json({
            success: true,
            xp: {
                totalXp,
                courseCompletionXp,
                quizXp,
                interviewXp,
                flashcardXp,
                codingXp
            }
        });

    } catch (error) {
        console.error("Error calculating XP:", error);
        return NextResponse.json({ error: "Failed to calculate XP" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");

        if (!userEmail) {
            return NextResponse.json({ error: "User email is required" }, { status: 400 });
        }

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

        const codingAttempts = await db
            .select({
                totalScore: codingAttemptsTable.totalScore,
                problemsAttempted: codingAttemptsTable.problemsAttempted
            })
            .from(codingAttemptsTable)
            .where(eq(codingAttemptsTable.userEmail, userEmail));

        const codingXp = codingAttempts.reduce((total, attempt) => {
            const percentage = attempt.problemsAttempted && attempt.problemsAttempted > 0
                ? (attempt.totalScore || 0) / attempt.problemsAttempted
                : (attempt.totalScore || 0);
            return total + Math.round(percentage);
        }, 0);

        const totalXp = courseCompletionXp + quizXp + interviewXp + flashcardXp + codingXp;

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
                    codingXp,
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
                flashcardXp,
                codingXp
            });
        }

        return NextResponse.json({
            totalXp,
            courseCompletionXp,
            quizXp,
            interviewXp,
            flashcardXp,
            codingXp,
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error("Error fetching XP:", error);
        return NextResponse.json({ error: "Failed to fetch XP" }, { status: 500 });
    }
}