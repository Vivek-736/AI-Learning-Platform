"use client";

import { useEffect, useState } from "react";
import { Trophy, Sparkles, Crown, Medal, Award, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

interface LeaderboardEntry {
    rank: number;
    name: string;
    email: string;
    totalXp: number;
    courseCompletionXp: number;
    quizXp: number;
    interviewXp: number;
    flashcardXp: number;
}

export default function LeaderboardPage() {
    const { user } = useUser();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState<number | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("/api/leaderboard");
                if (response.ok) {
                    const data = await response.json();
                    setLeaderboard(data.leaderboard);
                    
                    const currentUserEntry = data.leaderboard.find(
                        (entry: LeaderboardEntry) => entry.email === user?.primaryEmailAddress?.emailAddress
                    );
                    if (currentUserEntry) {
                        setUserRank(currentUserEntry.rank);
                    }
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-[76vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-lg font-bold text-blue-600">Loading...</p>
                </div>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);
    const restOfLeaderboard = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-gradient-to-br rounded-xl from-blue-50 via-purple-50 to-pink-50">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Trophy className="w-12 h-12 text-yellow-500" strokeWidth={2.5} />
                        <h1 className="text-5xl font-black text-gray-800">
                            Leaderboard
                        </h1>
                        <Trophy className="w-12 h-12 text-yellow-500" strokeWidth={2.5} />
                    </div>
                    <p className="text-xl font-semibold text-gray-600">
                        Compete with learners worldwide! 🌍
                    </p>
                </motion.div>

                {userRank && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-4 bg-green-500 text-white rounded-2xl shadow-lg">
                            <Sparkles className="w-6 h-6" strokeWidth={2.5} />
                            <span className="text-xl font-black">
                                You&apos;re Rank #{userRank}!
                            </span>
                            <Flame className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                    </motion.div>
                )}

                {topThree.length > 0 && (
                    <div className="mb-12">
                        <div className="grid grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
                            {topThree[1] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="pb-8"
                                >
                                    <TopThreeCard entry={topThree[1]} currentUserEmail={user?.primaryEmailAddress?.emailAddress} />
                                </motion.div>
                            )}

                            {topThree[0] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <TopThreeCard entry={topThree[0]} currentUserEmail={user?.primaryEmailAddress?.emailAddress} />
                                </motion.div>
                            )}

                            {topThree[2] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="pb-16"
                                >
                                    <TopThreeCard entry={topThree[2]} currentUserEmail={user?.primaryEmailAddress?.emailAddress} />
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}

                {restOfLeaderboard.length > 0 && (
                    <div className="max-w-3xl mx-auto space-y-3">
                        {restOfLeaderboard.map((entry, index) => {
                            const isCurrentUser = entry.email === user?.primaryEmailAddress?.emailAddress;
                            
                            return (
                                <motion.div
                                    key={entry.email}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.05, duration: 0.4 }}
                                    className={`
                                        flex items-center gap-4 p-5 rounded-2xl shadow-md
                                        transition-all duration-200 hover:shadow-xl hover:scale-[1.02]
                                        ${isCurrentUser 
                                            ? 'bg-green-400 border-4 border-green-500' 
                                            : 'bg-white border-4 border-gray-200'
                                        }
                                    `}
                                >
                                    <div className={`
                                        flex items-center justify-center w-12 h-12 rounded-xl font-black text-xl
                                        ${isCurrentUser ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}
                                    `}>
                                        {entry.rank}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`text-lg font-bold ${
                                                isCurrentUser ? 'text-white' : 'text-gray-800'
                                            }`}>
                                                {entry.name}
                                            </h3>
                                            {isCurrentUser && (
                                                <span className="bg-white text-green-600 text-xs font-black px-2 py-1 rounded-full">
                                                    YOU
                                                </span>
                                            )}
                                        </div>
                                        <div className={`flex gap-2 text-sm font-semibold ${
                                            isCurrentUser ? 'text-green-100' : 'text-gray-500'
                                        }`}>
                                            <span>📚 {entry.courseCompletionXp}</span>
                                            <span>•</span>
                                            <span>📝 {entry.quizXp}</span>
                                            <span>•</span>
                                            <span>🎯 {entry.flashcardXp}</span>
                                        </div>
                                    </div>

                                    <div className={`
                                        px-5 py-3 rounded-xl font-black text-xl
                                        ${isCurrentUser 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-blue-500 text-white'
                                        }
                                    `}>
                                        {entry.totalXp.toLocaleString()} XP
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {leaderboard.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-lg border-4 border-gray-200">
                        <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-6" strokeWidth={2} />
                        <p className="text-2xl font-bold text-gray-600 mb-2">
                            No rankings yet!
                        </p>
                        <p className="text-lg text-gray-500">
                            Be the first to earn XP and claim the top spot! 🚀
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TopThreeCard({ entry, currentUserEmail }: { entry: LeaderboardEntry; currentUserEmail?: string }) {
    const isCurrentUser = entry.email === currentUserEmail;
    const colors = getTopThreeColors(entry.rank);
    const icon = getRankIcon(entry.rank);

    return (
        <div className={`
            relative rounded-3xl shadow-2xl overflow-hidden
            transition-all duration-300 hover:scale-105 hover:shadow-3xl
            border-4 ${colors.border}
            ${isCurrentUser ? 'ring-4 ring-green-500 ring-offset-4' : ''}
        `}>
            <div className={`${colors.bg} p-6`}>
                <div className={`${colors.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    {icon}
                </div>

                <div className={`${colors.accent} px-4 py-1 rounded-full font-black text-sm mb-3 mx-auto block text-center ${colors.text}`}>
                    {entry.rank === 1 ? '🥇 1ST PLACE' : entry.rank === 2 ? '🥈 2ND PLACE' : '🥉 3RD PLACE'}
                </div>

                <h3 className={`text-xl font-black mb-2 ${colors.text} text-center`}>
                    {entry.name}
                </h3>

                {isCurrentUser && (
                    <div className="bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full inline-block mb-3">
                        THAT&apos;S YOU! 🎉
                    </div>
                )}

                <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
                    <div className="text-center">
                        <div className={`text-3xl font-black ${colors.text} mb-1`}>
                            {entry.totalXp.toLocaleString()}
                        </div>
                        <div className="text-sm font-bold text-gray-600">TOTAL XP</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <BreakdownRow label="📚 Courses" value={entry.courseCompletionXp} color={colors.accent} textColor={colors.text} />
                    <BreakdownRow label="📝 Quizzes" value={entry.quizXp} color={colors.accent} textColor={colors.text} />
                    <BreakdownRow label="🎯 Flashcards" value={entry.flashcardXp} color={colors.accent} textColor={colors.text} />
                </div>
            </div>
        </div>
    );
}

function BreakdownRow({ label, value, color, textColor }: { label: string; value: number; color: string; textColor: string }) {
    return (
        <div className={`${color} rounded-xl p-2 flex justify-between items-center`}>
            <span className={`text-sm font-bold ${textColor}`}>{label}</span>
            <span className={`text-sm font-black ${textColor}`}>{value}</span>
        </div>
    );
}

function getTopThreeColors(rank: number) {
    if (rank === 1) return {
        bg: "bg-yellow-400",
        text: "text-yellow-900",
        border: "border-yellow-500",
        iconBg: "bg-yellow-500",
        accent: "bg-yellow-300"
    };
    if (rank === 2) return {
        bg: "bg-blue-400",
        text: "text-blue-900",
        border: "border-blue-500",
        iconBg: "bg-blue-500",
        accent: "bg-blue-300"
    };
    if (rank === 3) return {
        bg: "bg-purple-400",
        text: "text-purple-900",
        border: "border-purple-500",
        iconBg: "bg-purple-500",
        accent: "bg-purple-300"
    };
    return {
        bg: "bg-gray-100",
        text: "text-gray-900",
        border: "border-gray-300",
        iconBg: "bg-gray-400",
        accent: "bg-gray-200"
    };
}

function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-900" strokeWidth={2.5} />;
    if (rank === 2) return <Award className="w-8 h-8 text-blue-900" strokeWidth={2.5} />;
    if (rank === 3) return <Medal className="w-8 h-8 text-purple-900" strokeWidth={2.5} />;
    
    return null;
}