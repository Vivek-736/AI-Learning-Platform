import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "1000"); // Get all users

        const allUsers = await db.select().from(usersTable);
        const leaderboardData = [];

        for (const user of allUsers) {
            try {
                const xpResponse = await fetch(`${req.nextUrl.origin}/api/xp?userEmail=${user.email}`);
                if (xpResponse.ok) {
                    const xpData = await xpResponse.json();
                    leaderboardData.push({
                        name: user.name,
                        email: user.email,
                        totalXp: xpData.totalXp || 0,
                        courseCompletionXp: xpData.courseCompletionXp || 0,
                        quizXp: xpData.quizXp || 0,
                        interviewXp: xpData.interviewXp || 0,
                        flashcardXp: xpData.flashcardXp || 0,
                        codingXp: xpData.codingXp || 0,
                    });
                }
            } catch (error) {
                console.error(`Error fetching XP for ${user.email}:`, error);
                leaderboardData.push({
                    name: user.name,
                    email: user.email,
                    totalXp: 0,
                    courseCompletionXp: 0,
                    quizXp: 0,
                    interviewXp: 0,
                    flashcardXp: 0,
                    codingXp: 0,
                });
            }
        }

        leaderboardData.sort((a, b) => b.totalXp - a.totalXp);
        const rankedLeaderboard = leaderboardData.slice(0, limit).map((user, index) => ({
            ...user,
            rank: index + 1
        }));

        return NextResponse.json({ leaderboard: rankedLeaderboard });

    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}