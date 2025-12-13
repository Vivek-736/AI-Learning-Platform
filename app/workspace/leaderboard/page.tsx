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
    codingXp: number;
}

const getLevel = (xp: number) => Math.floor(xp / 100) + 1;
const getXPInCurrentLevel = (xp: number) => xp % 100;
const getProgressPercentage = (xp: number) => (getXPInCurrentLevel(xp) / 100) * 100;

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
            <div className="min-h-[76vh] flex items-center justify-center bg-gray-50 dark:bg-[#09090b]">
                <div className="text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin" />
                        <div className="absolute inset-1 rounded-full bg-gray-50 dark:bg-[#09090b]" />
                    </div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Loading Leaderboard...</p>
                </div>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);
    const restOfLeaderboard = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#09090b]">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-3 mb-3">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300">
                            Global Leaderboard
                        </h1>
                    </div>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium">
                        Top learners competing worldwide 🌍
                    </p>
                </motion.div>

                {userRank && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl shadow-lg dark:shadow-indigo-500/20">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-lg font-bold">
                                Your Rank: #{userRank}
                            </span>
                            <Flame className="w-5 h-5" />
                        </div>
                    </motion.div>
                )}

                {topThree.length > 0 && (
                    <div className="mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end max-w-5xl mx-auto">
                            {topThree[1] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="md:pb-8"
                                >
                                    <TopThreeCard entry={topThree[1]} currentUserEmail={user?.primaryEmailAddress?.emailAddress} />
                                </motion.div>
                            )}

                            {topThree[0] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                >
                                    <TopThreeCard entry={topThree[0]} currentUserEmail={user?.primaryEmailAddress?.emailAddress} />
                                </motion.div>
                            )}

                            {topThree[2] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                    className="md:pb-16"
                                >
                                    <TopThreeCard entry={topThree[2]} currentUserEmail={user?.primaryEmailAddress?.emailAddress} />
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}

                {restOfLeaderboard.length > 0 && (
                    <div className="max-w-4xl mx-auto space-y-2">
                        {restOfLeaderboard.map((entry, index) => {
                            const isCurrentUser = entry.email === user?.primaryEmailAddress?.emailAddress;
                            const level = getLevel(entry.totalXp);
                            const xpInLevel = getXPInCurrentLevel(entry.totalXp);
                            const progress = getProgressPercentage(entry.totalXp);
                            
                            return (
                                <motion.div
                                    key={entry.email}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.03, duration: 0.3 }}
                                    className={`
                                        group relative overflow-hidden rounded-xl border-2
                                        transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                                        ${isCurrentUser 
                                            ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 dark:shadow-indigo-500/10' 
                                            : 'bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3 md:gap-4 p-4">
                                        <div className={`
                                            flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg font-bold text-lg
                                            ${isCurrentUser 
                                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white shadow-md dark:shadow-indigo-500/20' 
                                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-zinc-700'
                                            }
                                        `}>
                                            {entry.rank}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className={`font-bold text-base md:text-lg truncate ${
                                                    isCurrentUser ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'
                                                }`}>
                                                    {entry.name}
                                                </h3>

                                                {isCurrentUser && (
                                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                                                        YOU
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mb-2 hidden md:block">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-500 ${
                                                                isCurrentUser 
                                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500' 
                                                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                            }`}
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                                                        {xpInLevel}/100 XP
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`flex flex-wrap gap-1.5 md:gap-2 text-xs font-medium ${
                                                isCurrentUser ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                <span className="flex items-center gap-1">📚 {entry.courseCompletionXp}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">📝 {entry.quizXp}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">💻 {entry.codingXp}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">🎯 {entry.flashcardXp}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">🎤 {entry.interviewXp}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-1">
                                            <div className={`
                                                inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold
                                                ${isCurrentUser 
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white' 
                                                    : 'bg-gray-800 dark:bg-zinc-800 text-white'
                                                }
                                            `}>
                                                <Trophy className="w-4 h-4" />
                                                Level {level}
                                            </div>
                                        </div>

                                        <div className={`
                                            flex flex-col items-end justify-center px-3 md:px-4 py-2 rounded-lg
                                            ${isCurrentUser 
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white' 
                                                : 'bg-gray-800 dark:bg-zinc-800 text-white'
                                            }
                                        `}>
                                            <span className="text-lg md:text-xl font-bold">
                                                {entry.totalXp.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-medium opacity-90">
                                                TOTAL XP
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {leaderboard.length === 0 && (
                    <div className="text-center py-16 md:py-20 bg-white dark:bg-zinc-900/50 rounded-2xl shadow-md border-2 border-gray-200 dark:border-zinc-800 max-w-2xl mx-auto">
                        <Trophy className="w-16 h-16 md:w-20 md:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                        <p className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                            No rankings yet!
                        </p>
                        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 px-4">
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
    const level = getLevel(entry.totalXp);
    const xpInLevel = getXPInCurrentLevel(entry.totalXp);
    const progress = getProgressPercentage(entry.totalXp);

    return (
        <div className={`
            relative rounded-2xl shadow-xl overflow-hidden
            transition-all duration-300 hover:scale-105 hover:shadow-2xl
            border-2 ${colors.border}
            ${isCurrentUser ? 'ring-4 ring-indigo-400 dark:ring-indigo-500 ring-offset-2 dark:ring-offset-[#09090b]' : ''}
        `}>
            <div className={`${colors.bg} p-5 md:p-6`}>
                <div className="relative mb-4">
                    <div className={`${colors.iconBg} w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mx-auto shadow-lg`}>
                        {icon}
                    </div>
                    <div className={`${colors.accent} px-3 py-1 rounded-lg font-bold text-xs mt-3 mx-auto block text-center ${colors.text}`}>
                        {entry.rank === 1 ? '🥇 1ST' : entry.rank === 2 ? '🥈 2ND' : '🥉 3RD'}
                    </div>
                </div>

                <h3 className={`text-lg md:text-xl font-bold mb-1 ${colors.text} text-center truncate px-2`}>
                    {entry.name}
                </h3>

                <div className="flex justify-center mb-3">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${colors.levelBg} ${colors.text} text-sm font-semibold`}>
                        <Trophy className="w-4 h-4" />
                        Level {level}
                    </div>
                </div>

                {isCurrentUser && (
                    <div className="flex justify-center mb-3">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                            YOU! 🎉
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-900/80 rounded-xl p-4 mb-3 shadow-md">
                    <div className="text-center">
                        <div className={`text-2xl md:text-3xl font-bold ${colors.text} mb-0.5`}>
                            {entry.totalXp.toLocaleString()}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">TOTAL XP</div>
                    </div>
                </div>

                <div className="mb-3 bg-white/50 dark:bg-zinc-900/30 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Level Progress</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{xpInLevel}/100</span>
                    </div>
                    <div className="w-full h-2 bg-white dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${colors.progressBg} rounded-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <BreakdownRow label="📚 Courses" value={entry.courseCompletionXp} color={colors.accent} textColor={colors.text} />
                    <BreakdownRow label="📝 Quizzes" value={entry.quizXp} color={colors.accent} textColor={colors.text} />
                    <BreakdownRow label="💻 Coding" value={entry.codingXp} color={colors.accent} textColor={colors.text} />
                    <BreakdownRow label="🎯 Flashcards" value={entry.flashcardXp} color={colors.accent} textColor={colors.text} />
                    <BreakdownRow label="🎤 Interviews" value={entry.interviewXp} color={colors.accent} textColor={colors.text} />
                </div>
            </div>
        </div>
    );
}

function BreakdownRow({ label, value, color, textColor }: { label: string; value: number; color: string; textColor: string }) {
    return (
        <div className={`${color} rounded-lg p-2 flex justify-between items-center`}>
            <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
            <span className={`text-xs font-bold ${textColor}`}>{value}</span>
        </div>
    );
}

function getTopThreeColors(rank: number) {
    if (rank === 1) return {
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        text: "text-yellow-800 dark:text-yellow-400",
        border: "border-yellow-300 dark:border-yellow-700",
        iconBg: "bg-yellow-400 dark:bg-yellow-600",
        accent: "bg-yellow-200/80 dark:bg-yellow-900/40",
        levelBg: "bg-yellow-400 dark:bg-yellow-600",
        progressBg: "bg-yellow-400 dark:bg-yellow-500"
    };
    if (rank === 2) return {
        bg: "bg-gray-50 dark:bg-gray-900/30",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-200 dark:border-gray-700",
        iconBg: "bg-gray-100 dark:bg-gray-700",
        accent: "bg-gray-100/80 dark:bg-gray-800/40",
        levelBg: "bg-gray-100 dark:bg-gray-700",
        progressBg: "bg-gray-300 dark:bg-gray-500"
    };
    if (rank === 3) return {
        bg: "bg-stone-50 dark:bg-stone-950/20",
        text: "text-stone-800 dark:text-stone-400",
        border: "border-stone-300 dark:border-stone-700",
        iconBg: "bg-stone-400 dark:bg-stone-600",
        accent: "bg-stone-200/80 dark:bg-stone-900/40",
        levelBg: "bg-stone-400 dark:bg-stone-600",
        progressBg: "bg-stone-400 dark:bg-stone-500"
    };
    return {
        bg: "bg-gray-100 dark:bg-gray-900/30",
        text: "text-gray-900 dark:text-gray-200",
        border: "border-gray-300 dark:border-gray-700",
        iconBg: "bg-gray-400 dark:bg-gray-600",
        accent: "bg-gray-200 dark:bg-gray-800/40",
        levelBg: "bg-gray-400 dark:bg-gray-600",
        progressBg: "bg-gray-500 dark:bg-gray-500"
    };
}

function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-700" strokeWidth={2.5} />;
    if (rank === 2) return <Award className="w-8 h-8 text-gray-600" strokeWidth={2.5} />;
    if (rank === 3) return <Medal className="w-8 h-8 text-stone-700" strokeWidth={2.5} />;
    
    return null;
}