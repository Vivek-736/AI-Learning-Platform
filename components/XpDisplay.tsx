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
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 rounded-full border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Loading...</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-50 dark:from-indigo-950 dark:via-indigo-900 dark:to-indigo-950 rounded-full border border-indigo-300 dark:border-indigo-700 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50"
        >
            <div className="relative">
                <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Total XP</span>
                <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300 leading-none">
                    {xpData.totalXp.toLocaleString()}
                </span>
            </div>
        </motion.div>
    );
}