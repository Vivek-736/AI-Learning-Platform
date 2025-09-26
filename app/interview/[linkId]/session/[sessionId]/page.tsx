'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Phone, PhoneOff, User, Bot, Volume2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import Vapi from '@vapi-ai/web';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4">
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6 mt-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{sessionInfo.templateTitle}</h1>
                    <p className="text-gray-600">Interview with {sessionInfo.candidateName}</p>
                    
                    {isCallActive && (
                        <div className="flex items-center justify-center space-x-2 text-red-600 mt-4">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="font-mono text-xl">{formatTime(timeElapsed)}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Interview Control</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                                    isCallActive ? 'bg-red-100 animate-pulse shadow-lg' : 'bg-blue-100'
                                }`}>
                                    {isCallActive ? (
                                        <Volume2 className="h-16 w-16 text-red-600" />
                                    ) : (
                                        <Mic className="h-16 w-16 text-blue-600" />
                                    )}
                                </div>

                                {!isCallActive ? (
                                    <Button 
                                        onClick={startInterview}
                                        disabled={isLoading}
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-200 cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <Phone className="h-5 w-5 mr-2" />
                                                Start Interview
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={endInterview}
                                        size="lg"
                                        variant="destructive"
                                        className="w-full hover:bg-red-700 transition-colors duration-200"
                                    >
                                        <PhoneOff className="h-5 w-5 mr-2" />
                                        End Interview
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Duration:</span>
                                    <Badge variant="outline">{sessionInfo.estimatedDuration} min</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Difficulty:</span>
                                    <Badge variant={sessionInfo.difficulty === 'hard' ? 'destructive' : sessionInfo.difficulty === 'medium' ? 'default' : 'secondary'}>
                                        {sessionInfo.difficulty}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Course:</span>
                                    <span className="text-right font-medium">{sessionInfo.courseName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Status:</span>
                                    <Badge variant={isCallActive ? 'default' : 'outline'}>
                                        {isCallActive ? 'In Progress' : 'Ready'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Bot className="h-5 w-5 mr-2" />
                                Live Conversation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div 
                                ref={chatContainerRef}
                                className="h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg border"
                            >
                                {conversation.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-8">
                                        <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium mb-2">Ready to start</p>
                                        <p className="text-sm">Your conversation will appear here in real-time</p>
                                    </div>
                                ) : (
                                    conversation.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-lg shadow-sm transition-all duration-200 ${
                                                msg.sender === 'user' 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-white border border-gray-200'
                                            }`}>
                                                <div className="flex items-center mb-1">
                                                    {msg.sender === 'user' ? (
                                                        <User className="h-4 w-4 mr-2" />
                                                    ) : (
                                                        <Bot className="h-4 w-4 mr-2" />
                                                    )}
                                                    <span className="text-xs opacity-75 font-medium">
                                                        {msg.sender === 'user' ? 'You' : 'Interviewer'}
                                                    </span>
                                                </div>
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
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
