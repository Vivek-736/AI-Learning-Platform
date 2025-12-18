'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Phone, PhoneOff, User, Bot, Volume2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import Vapi from '@vapi-ai/web';
import Image from 'next/image';
import localFont from "next/font/local";

const nohemi = localFont({
    src: [
        {
            path: "../../../../../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../../../../public/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../../../../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../../../../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-nohemi",
});

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Message {
    sender: 'user' | 'bot';
    text: string;
    timestamp: number;
}

const VoiceInterviewSession = () => {
    const params = useParams();
    const router = useRouter();
    const linkId = params.linkId as string;
    const sessionId = params.sessionId as string;

    const [isCallActive, setIsCallActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [conversation, setConversation] = useState<Message[]>([]);
    const [sessionInfo, setSessionInfo] = useState<any>(null);

    const conversationRef = useRef<any[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const vapiRef = useRef<Vapi | null>(null);

    useEffect(() => {
        if (sessionId) {
            fetchSessionInfo();
            initializeVapi();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCallActive && startTime) {
            interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCallActive, startTime]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    const fetchSessionInfo = async () => {
        try {
            const response = await axios.get(`/api/interview/sessions/${sessionId}`);
            setSessionInfo(response.data);
        } catch (error) {
            console.error('Error fetching session:', error);
            toast.error('Invalid session');
            router.push('/');
        }
    };

    const initializeVapi = () => {
        if (!process.env.NEXT_PUBLIC_VAPI_KEY) {
            console.error('VAPI_KEY not found in environment variables');
            toast.error('Voice service not configured');
            return;
        }

        try {
            vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);
            setupVapiEvents();
        } catch (error) {
            console.error('Failed to initialize Vapi:', error);
            toast.error('Failed to initialize voice service');
        }
    };

    const setupVapiEvents = () => {
        if (!vapiRef.current) return;

        vapiRef.current.on('call-start', () => {
            setIsCallActive(true);
            setIsLoading(false);
            setStartTime(Date.now());
            toast.success('Interview started! Please speak clearly.');
        });

        vapiRef.current.on('call-end', () => {
            setIsCallActive(false);
            handleEndInterview();
        });

        vapiRef.current.on('message', (message: any) => {
            console.log('VAPI message:', message);
            
            if (message?.type === 'transcript' && message?.transcript) {
                const { transcript, role } = message.transcript;
                
                if (role && transcript) {
                    const newMessage: Message = {
                        sender: role === 'user' ? 'user' : 'bot',
                        text: transcript,
                        timestamp: Date.now()
                    };
                    
                    setConversation(prev => {
                        const updated = [...prev];
                        const lastMessage = updated[updated.length - 1];
                        
                        if (lastMessage && lastMessage.sender === newMessage.sender) {
                            updated[updated.length - 1] = newMessage;
                        } else {
                            updated.push(newMessage);
                        }
                        
                        return updated;
                    });
                }
            }
            
            if (message?.conversation) {
                conversationRef.current = message.conversation;
                
                const newMessages: Message[] = message.conversation
                    .filter((msg: any) => msg.role !== 'system' && msg.content?.trim())
                    .map((msg: any) => ({
                        sender: msg.role === 'user' ? 'user' : 'bot',
                        text: msg.content.trim(),
                        timestamp: Date.now()
                    }));

                setConversation(newMessages);
            }
        });

        vapiRef.current.on('error', (error: any) => {
            console.error('VAPI error:', error);
            toast.error('Voice connection error. Please try again.');
            setIsCallActive(false);
            setIsLoading(false);
        });

        vapiRef.current.on('speech-start', () => {
            console.log('Speech started');
        });

        vapiRef.current.on('speech-end', () => {
            console.log('Speech ended');
        });
    };

    const startInterview = async () => {
        if (!vapiRef.current) {
            toast.error('Voice service not initialized');
            return;
        }

        if (!sessionInfo) {
            toast.error('Session information not loaded');
            return;
        }

        setIsLoading(true);

        try {
            await axios.patch(`/api/interview/sessions/${sessionId}`, {
                status: 'in_progress',
                startedAt: new Date().toISOString()
            });

            const assistantConfig = {
                name: "Interview Assistant",
                firstMessage: `Hello! I'm your AI interviewer for the ${sessionInfo?.templateTitle} interview. This will take about ${sessionInfo?.estimatedDuration} minutes. Let's begin with: Please introduce yourself and tell me about your background.`,
                transcriber: {
                    provider: "deepgram",
                    model: "nova-2",
                    language: "en",
                },
                voice: {
                    provider: "11labs",
                    voiceId: "sarah",
                    stability: 0.4,
                    similarityBoost: 0.8,
                    speed: 0.9,
                    style: 0.5,
                    useSpeakerBoost: true
                },
                model: {
                    provider: "openai",
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: `You are conducting a professional interview for ${sessionInfo?.courseName}. 
                            
                            Interview Details:
                            - Position: ${sessionInfo?.templateTitle}
                            - Duration: ${sessionInfo?.estimatedDuration} minutes
                            - Difficulty: ${sessionInfo?.difficulty}
                            
                            Questions to cover: ${JSON.stringify(sessionInfo?.questions)}
                            Skills to assess: ${JSON.stringify(sessionInfo?.skillsToAssess)}
                            
                            Instructions:
                            - Be professional, encouraging, and conversational
                            - Ask follow-up questions based on responses
                            - Don't read code snippets aloud - just acknowledge technical knowledge
                            - Keep responses concise and engaging
                            - Adapt questions based on candidate's experience level
                            - End gracefully when time is up or all key areas are covered`
                        }
                    ],
                    temperature: 0.7,
                }
            };

            await vapiRef.current.start(assistantConfig as any);
            
        } catch (error) {
            console.error('Error starting interview:', error);
            toast.error('Failed to start interview');
            setIsLoading(false);
        }
    };

    const endInterview = async () => {
        if (vapiRef.current) {
            try {
                await vapiRef.current.stop();
            } catch (error) {
                console.error('Error stopping call:', error);
                setIsCallActive(false);
                handleEndInterview();
            }
        }
    };

    const handleEndInterview = async () => {
        try {
            await axios.patch(`/api/interview/sessions/${sessionId}`, {
                status: 'completed',
                completedAt: new Date().toISOString(),
                duration: timeElapsed,
                conversationTranscript: conversationRef.current.length > 0 ? conversationRef.current : conversation
            });

            toast.success('Interview completed! Generating your feedback...');
            
            setTimeout(() => {
                router.push(`/interview/${linkId}/results/${sessionId}`);
            }, 2000);
            
        } catch (error) {
            console.error('Error ending interview:', error);
            toast.error('Failed to save interview');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        return () => {
            if (vapiRef.current && isCallActive) {
                vapiRef.current.stop();
            }
        };
    }, [isCallActive]);

    if (!sessionInfo) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-white dark:bg-black p-4 lg:p-8 ${nohemi.variable}`}>
            <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] dark:opacity-[0.08] pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4 border border-indigo-100 dark:border-indigo-900/50">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        Live Session
                    </div>
                    <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 ${nohemi.className}`}>{sessionInfo.templateTitle}</h1>
                    <p className="text-gray-500 dark:text-gray-400">Interview with {sessionInfo.candidateName}</p>
                    
                    {isCallActive && (
                        <div className="flex items-center justify-center space-x-2 text-rose-500 mt-4 bg-rose-50 dark:bg-rose-950/20 py-1.5 px-4 rounded-full mx-auto w-fit">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                            <span className="font-mono font-medium text-lg">{formatTime(timeElapsed)}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Control Panel */}
                    <Card className="border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e] shadow-xl h-full flex flex-col">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800/50 pb-4">
                            <CardTitle className={`flex items-center text-gray-900 dark:text-white ${nohemi.className}`}>
                                <Volume2 className="h-5 w-5 mr-3 text-indigo-500" />
                                Audio Interface
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center py-10 space-y-8">
                            
                            {/* Visualizer Container */}
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl transition-opacity duration-500 ${isCallActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
                                <div className={`relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${isCallActive ? 'scale-105 ring-4 ring-indigo-500/20' : 'grayscale hover:grayscale-0'}`}>
                                    <Image 
                                        src="/ai_voice_interview_visual.png" 
                                        alt="AI Voice Interface" 
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {!isCallActive && !isLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                            <Mic className="text-white w-16 h-16 opacity-80" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full max-w-sm space-y-6">
                                {!isCallActive ? (
                                    <Button 
                                        onClick={startInterview}
                                        disabled={isLoading}
                                        className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <Phone className="h-5 w-5 mr-3" />
                                                Start Interview
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={endInterview}
                                        variant="destructive"
                                        className="w-full h-14 text-lg bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg hover:shadow-rose-500/25 transition-all duration-300"
                                    >
                                        <PhoneOff className="h-5 w-5 mr-3" />
                                        End Interview
                                    </Button>
                                )}
                            </div>

                            <div className="w-full bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800/60">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Duration</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{sessionInfo.estimatedDuration} min</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Difficulty</span>
                                        <Badge variant="outline" className={`capitalize ${
                                            sessionInfo.difficulty === 'hard' ? 'text-rose-600 border-rose-200' : 
                                            sessionInfo.difficulty === 'medium' ? 'text-amber-600 border-amber-200' : 
                                            'text-emerald-600 border-emerald-200'
                                        }`}>
                                            {sessionInfo.difficulty}
                                        </Badge>
                                    </div>
                                    <div className="col-span-2 flex justify-between items-center border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
                                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-indigo-500' : 'bg-gray-400'}`}></div>
                                            <span className="font-medium text-gray-900 dark:text-white">{isCallActive ? 'Live' : 'Ready'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chat Panel */}
                    <Card className="border-gray-200 dark:border-gray-800 dark:bg-[#0c0c0e] shadow-xl h-full flex flex-col">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800/50 pb-4">
                            <CardTitle className={`flex items-center text-gray-900 dark:text-white ${nohemi.className}`}>
                                <Bot className="h-5 w-5 mr-3 text-indigo-500" />
                                Live Transcript
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative">
                            <div 
                                ref={chatContainerRef}
                                className="absolute inset-0 overflow-y-auto p-6 space-y-4 scroll-smooth"
                            >
                                {conversation.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-full">
                                            <Sparkles className="h-8 w-8 text-indigo-400 opacity-60" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium text-gray-600 dark:text-gray-300">Ready to start</p>
                                            <p className="text-sm">Conversation will appear here...</p>
                                        </div>
                                    </div>
                                ) : (
                                    conversation.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                                                msg.sender === 'user' 
                                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                                    : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                            }`}>
                                                <div className="flex items-center mb-2 opacity-80 decoration-slice">
                                                    {msg.sender === 'user' ? <User className="h-3 w-3 mr-2" /> : <Bot className="h-3 w-3 mr-2" />}
                                                    <span className="text-xs uppercase tracking-wider font-bold">
                                                        {msg.sender === 'user' ? 'You' : 'Interviewer'}
                                                    </span>
                                                </div>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VoiceInterviewSession;
