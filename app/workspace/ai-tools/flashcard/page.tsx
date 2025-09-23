'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, Brain, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateFlashcardDialog from './components/CreateFlashcardDialog';
import FlashcardSetCard from './components/FlashcardSetCard';
import FlashcardHistory from './components/FlashcardHistory';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

interface FlashcardSet {
    fid: string;
    title: string;
    description: string;
    totalCards: number;
    difficulty: string;
    createdAt: string;
    courseId?: string;
    customTopic?: string;
}

const FlashcardPage = () => {
    const { user } = useUser();
    const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (user) {
            fetchFlashcardSets();
        }
    }, [user]);

    const fetchFlashcardSets = async () => {
        try {
            const response = await axios.get('/api/flashcard');
            setFlashcardSets(response.data);
        } catch (error) {
            console.error('Error fetching flashcard sets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFlashcardCreated = () => {
        fetchFlashcardSets();
        setShowCreateDialog(false);
    };

    if (loading) {
        return (
            <div className="min-h-[74vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Smart Flashcards</h1>
                        <p className="text-gray-600">Master concepts with AI-generated flashcards</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => setShowCreateDialog(true)} className='cursor-pointer'>
                        <Plus className="h-4 w-4 mr-1" />
                        Create Flashcards
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sets</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{flashcardSets.length}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {flashcardSets.reduce((total, set) => total + set.totalCards, 0)}
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0h</div>
                        <p className="text-xs text-muted-foreground mt-1"></p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Flashcard Sets</h2>
                
                {flashcardSets.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No flashcard sets yet</h3>
                            <p className="text-gray-500 mb-6">Create your first AI-generated flashcard set to get started!</p>
                            <Button onClick={() => setShowCreateDialog(true)} className='cursor-pointer'>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Set
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {flashcardSets.map((set) => (
                            <FlashcardSetCard 
                                key={set.fid} 
                                flashcardSet={set} 
                                onUpdate={fetchFlashcardSets} 
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreateFlashcardDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onFlashcardCreated={handleFlashcardCreated}
            />

            <FlashcardHistory
                open={showHistory}
                onOpenChange={setShowHistory}
            />
        </div>
    );
};

export default FlashcardPage;
