"use client";

import { useEffect, useState } from "react";
import { Trophy, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

interface XpData {
    totalXp: number;
    courseCompletionXp: number;
    quizXp: number;
    interviewXp: number;
    flashcardXp: number;
}

export default function XpDisplay() {
    const { user } = useUser();
    const [xpData, setXpData] = useState<XpData>({
        totalXp: 0,
        courseCompletionXp: 0,
        quizXp: 0,
        interviewXp: 0,
        flashcardXp: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchXp = async () => {
            if (!user?.primaryEmailAddress?.emailAddress) return;
            
            try {
                const response = await fetch(`/api/xp?userEmail=${user?.primaryEmailAddress?.emailAddress}`);
                if (response.ok) {
                    const data = await response.json();
                    setXpData(data);
                }
            } catch (error) {
                console.error("Error fetching XP:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchXp();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-full border border-purple-200 dark:border-purple-800">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Loading...</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950 rounded-full border border-purple-300 dark:border-purple-700 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/50"
        >
            <div className="relative">
                <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total XP</span>
                <span className="font-bold text-lg text-purple-700 dark:text-purple-300 leading-none">
                    {xpData.totalXp.toLocaleString()}
                </span>
            </div>
        </motion.div>
    );
}