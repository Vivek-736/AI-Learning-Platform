'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RotateCcw, Eye, EyeOff, Home, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import { toast } from 'sonner';

interface Flashcard {
    id: string;
    front: string;
    back: string;
    explanation: string;
}

interface FlashcardSet {
    fid: string;
    title: string;
    description: string;
    totalCards: number;
    difficulty: string;
    flashcards: Flashcard[];
}

const FlashcardStudyPage = () => {
    const params = useParams();
    const router = useRouter();
    const fid = params.fid as string;

    const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
    const [reviewCards, setReviewCards] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchFlashcardSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fid]);

    const fetchFlashcardSet = async () => {
        try {
            const response = await axios.get(`/api/flashcard/${fid}`);
            setFlashcardSet(response.data);
        } catch (error) {
            console.error('Error fetching flashcard set:', error);
            toast.error('Failed to load flashcard set');
            router.push('/workspace/ai-tools/flashcard');
        } finally {
            setLoading(false);
        }
    };

    const handleFlipCard = () => {
        setIsFlipped(!isFlipped);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleNext = () => {
        if (flashcardSet && currentIndex < flashcardSet.flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handleMastered = () => {
        const newMastered = new Set(masteredCards);
        newMastered.add(currentIndex);
        setMasteredCards(newMastered);
        
        const newReview = new Set(reviewCards);
        newReview.delete(currentIndex);
        setReviewCards(newReview);

        toast.success('Card mastered!');
        
        if (flashcardSet && currentIndex < flashcardSet.flashcards.length - 1) {
            setTimeout(() => {
                handleNext();
            }, 300);
        }
    };

    const handleNeedsReview = () => {
        const newReview = new Set(reviewCards);
        newReview.add(currentIndex);
        setReviewCards(newReview);
        
        const newMastered = new Set(masteredCards);
        newMastered.delete(currentIndex);
        setMasteredCards(newMastered);

        toast.info('Marked for review');
        
        if (flashcardSet && currentIndex < flashcardSet.flashcards.length - 1) {
            setTimeout(() => {
                handleNext();
            }, 300);
        }
    };

    const resetStudySession = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setMasteredCards(new Set());
        setReviewCards(new Set());
        toast.info('Study session reset');
    };

    const getProgressPercentage = () => {
        if (!flashcardSet) return 0;
        return ((currentIndex + 1) / flashcardSet.flashcards.length) * 100;
    };

    const getMasteryPercentage = () => {
        if (!flashcardSet) return 0;
        return (masteredCards.size / flashcardSet.flashcards.length) * 100;
    };

    if (loading) {
        return (
            <div className="min-h-[76vh] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    if (!flashcardSet) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <p className="text-gray-600 mb-4">Flashcard set not found</p>
                        <Button onClick={() => router.push('/workspace/ai-tools/flashcard')}>
                            Back to Flashcards
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentCard = flashcardSet.flashcards[currentIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{flashcardSet.title}</h1>
                        <p className="text-gray-600 mt-1">Card {currentIndex + 1} of {flashcardSet.flashcards.length}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            {masteredCards.size} mastered
                        </Badge>
                        <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                            {reviewCards.size} review
                        </Badge>
                        <Button
                            onClick={resetStudySession}
                            variant="outline"
                            size="sm"
                            className="hover:bg-gray-50"
                        >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reset
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                            <span>Study Progress</span>
                            <span>{Math.round(getProgressPercentage())}%</span>
                        </div>
                        <Progress value={getProgressPercentage()} className="h-2" />
                    </div>
                    <div>
                        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                            <span>Mastery Progress</span>
                            <span>{Math.round(getMasteryPercentage())}%</span>
                        </div>
                        <Progress value={getMasteryPercentage()} className="h-2 [&>div]:bg-green-500" />
                    </div>
                </div>

                <div className="mb-8 flex justify-center">
                    <div className="w-96 h-[600px] perspective-1000">
                        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                            <Card 
                                className="w-96 h-[600px] cursor-pointer transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-blue-300"
                                onClick={handleFlipCard}
                            >
                                <CardContent className="h-full flex flex-col justify-between p-8">
                                    <div className="flex justify-between items-center">
                                        <Badge className={
                                            masteredCards.has(currentIndex) 
                                                ? 'bg-green-100 text-green-800 border-green-200' :
                                            reviewCards.has(currentIndex) 
                                                ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                'bg-blue-100 text-blue-800 border-blue-200'
                                        }>
                                            {masteredCards.has(currentIndex) ? 'Mastered' :
                                             reviewCards.has(currentIndex) ? 'Review' : 'New'}
                                        </Badge>
                                        <div className="text-xs text-gray-500 flex items-center">
                                            <Eye className="h-3 w-3 mr-1" />
                                            Click to flip
                                        </div>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center text-center">
                                        <div className="space-y-6">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                                <span className="text-2xl">❓</span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                                                {currentCard.front}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Tap to reveal answer</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card 
                                className="w-96 h-[600px] cursor-pointer transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400"
                                onClick={handleFlipCard}
                            >
                                <CardContent className="h-full flex flex-col justify-between p-8">
                                    <div className="flex justify-between items-center -mt-8">
                                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                            Answer
                                        </Badge>
                                        <div className="text-xs text-gray-600 flex items-center">
                                            <EyeOff className="h-3 w-3 mr-1" />
                                            Click to flip back
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center space-y-6">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-blue-700 mb-3">Question:</p>
                                            <p className="text-lg text-gray-700 mb-6">{currentCard.front}</p>
                                            
                                            <div className="border-t border-blue-200 pt-6">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-2xl">✅</span>
                                                </div>
                                                <p className="text-sm font-medium text-green-700 mb-2">Answer:</p>
                                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                                    {currentCard.back}
                                                </h2>
                                            </div>
                                        </div>

                                        {currentCard.explanation && (
                                            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4 -mt-4">
                                                <div className="flex items-start space-x-2">
                                                    <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-medium text-amber-700 mb-1">Explanation:</p>
                                                        <p className="text-sm text-gray-700">{currentCard.explanation}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </ReactCardFlip>
                    </div>
                </div>

                {isFlipped && (
                    <div className="mb-8 flex justify-center">
                        <Card className="w-96 border-2 border-gray-200 bg-white shadow-lg">
                            <CardContent className="pt-2">
                                <div className="flex justify-center space-x-4">
                                    <Button
                                        onClick={handleNeedsReview}
                                        variant="outline"
                                        className="flex items-center space-x-2 border-amber-300 hover:bg-amber-50 text-amber-700"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        <span>Need Review</span>
                                    </Button>
                                    <Button
                                        onClick={handleMastered}
                                        className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Mastered</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <Button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        variant="outline"
                        className="hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <Button
                        onClick={handleFlipCard}
                        variant="outline"
                        className="hover:bg-blue-50 border-blue-200 text-blue-700"
                    >
                        {isFlipped ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {isFlipped ? 'Hide Answer' : 'Show Answer'}
                    </Button>

                    {currentIndex === flashcardSet.flashcards.length - 1 ? (
                        <Button
                            onClick={() => router.push('/workspace/ai-tools/flashcard')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Finish Study
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={currentIndex === flashcardSet.flashcards.length - 1}
                            className="hover:bg-blue-50"
                        >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </div>

                {currentIndex === flashcardSet.flashcards.length - 1 && masteredCards.size === flashcardSet.flashcards.length && (
                    <Card className="mt-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <CardContent className="pt-6 text-center">
                            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-green-800 mb-2">
                                Congratulations!
                            </h3>
                            <p className="text-green-700">
                                You&apos;ve mastered all cards in this set. Excellent work on your study session!
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default FlashcardStudyPage;
