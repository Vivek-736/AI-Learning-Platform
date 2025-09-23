'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface Quiz {
    qid: string;
    title: string;
    totalQuestions: number;
    questions: Question[];
}

const QuizAttemptPage = () => {
    const params = useParams();
    const router = useRouter();
    const qid = params.qid as string;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid]);

    useEffect(() => {
        if (quiz && !startTime) {
            const estimatedTime = quiz.totalQuestions * 90;
            setTimeLeft(estimatedTime);
            setStartTime(Date.now());
        }
    }, [quiz, startTime]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleSubmitQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    const fetchQuiz = async () => {
        try {
            const response = await axios.get(`/api/quiz/${qid}`);
            setQuiz(response.data);
        } catch (error) {
            console.error('Error fetching quiz:', error);
            toast.error('Failed to load quiz');
            router.push('/workspace/ai-tools/quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const handleSubmitQuiz = async () => {
        if (!quiz || !startTime) return;

        setSubmitting(true);
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        try {
            const response = await axios.post(`/api/quiz/${qid}/submit`, {
                answers: userAnswers,
                timeSpent
            });

            toast.success('Quiz submitted successfully!');
            router.push(`/workspace/ai-tools/quiz/${qid}/results/${response.data.attemptId}`);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            toast.error('Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isQuizComplete = () => {
        return Object.keys(userAnswers).length === quiz?.totalQuestions;
    };

    if (loading) {
        return (
            <div className="min-h-[74vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quiz Not Found</h3>
                        <Button onClick={() => router.push('/workspace/ai-tools/quiz')}>
                            Back to Quizzes
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQ = quiz.questions[currentQuestion];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
                    <p className="text-gray-600">Question {currentQuestion + 1} of {quiz.totalQuestions}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(timeLeft)}
                    </div>
                    <div>
                        {Object.keys(userAnswers).length}/{quiz.totalQuestions} answered
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <Progress value={((currentQuestion + 1) / quiz.totalQuestions) * 100} />
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-xl">{currentQ.question}</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={userAnswers[currentQuestion]?.toString() || ''}
                        onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {currentQ.options.map((option, index) => (
                            <div 
                                key={index} 
                                className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer min-h-[100px] transition-colors duration-200"
                                onClick={() => handleAnswerSelect(currentQuestion, index)}
                            >
                                <RadioGroupItem 
                                    value={index.toString()} 
                                    id={`option-${index}`} 
                                    className="shrink-0"
                                />
                                <Label 
                                    htmlFor={`option-${index}`} 
                                    className="flex-1 cursor-pointer text-sm leading-relaxed select-none"
                                >
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => {
                        if (currentQuestion > 0) {
                            setCurrentQuestion(currentQuestion - 1);
                            setUserAnswers(prev => {
                                const newAnswers = { ...prev };
                                delete newAnswers[currentQuestion];
                                return newAnswers;
                            });
                        }
                    }}
                    disabled={currentQuestion === 0}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>

                {currentQuestion === quiz.totalQuestions - 1 ? (
                    <Button
                        onClick={handleSubmitQuiz}
                        disabled={submitting || !isQuizComplete()}
                    >
                        <Flag className="h-4 w-4 mr-2" />
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            if (currentQuestion < quiz.totalQuestions - 1) {
                                setCurrentQuestion(currentQuestion + 1);
                                setUserAnswers(prev => {
                                    const newAnswers = { ...prev };
                                    delete newAnswers[currentQuestion + 1];
                                    return newAnswers;
                                });
                            }
                        }}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default QuizAttemptPage;
