'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2, AlertCircle, Copy } from 'lucide-react';
import { Message, EnrolledCourse } from '@/types/assistant';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatInterfaceProps {
  enrollmentId: number;
  enrolledCourse: EnrolledCourse;
  conversationId: string | null;
  onConversationChange: (conversationId: string) => void;
}

const EnhancedMessageBubble = ({ message }: { message: Message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3);
        const lines = codeContent.split('\n');
        const language = lines[0].trim() || 'javascript';
        const code = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="my-4 relative group">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm text-gray-300 font-medium">{language}</span>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  background: 'transparent',
                  fontSize: '0.875rem',
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }
      
      return (
        <div key={index}>
          {part.split(/(`[^`]+`|\*\*[^*]+\*\*|<sup>[^<]+<\/sup>|<sub>[^<]+<\/sub>|<[^>]+>[^<]*<\/[^>]+>)/g).map((segment, segIndex) => {
            // Handle inline code
            if (segment.startsWith('`') && segment.endsWith('`')) {
              return (
                <code
                  key={segIndex}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 rounded font-mono text-sm border dark:border-gray-700"
                >
                  {segment.slice(1, -1)}
                </code>
              );
            }
            
            // Handle bold text
            if (segment.startsWith('**') && segment.endsWith('**')) {
              return (
                <strong
                  key={segIndex}
                  className="font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1 py-0.5 rounded"
                >
                  {segment.slice(2, -2)}
                </strong>
              );
            }

            // Handle superscript
            if (segment.startsWith('<sup>') && segment.endsWith('</sup>')) {
              return (
                <sup
                  key={segIndex}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400"
                  style={{ fontSize: '0.6em', verticalAlign: 'super' }}
                >
                  {segment.slice(5, -6)}
                </sup>
              );
            }

            if (segment.startsWith('<sub>') && segment.endsWith('</sub>')) {
              return (
                <sub
                  key={segIndex}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400"
                  style={{ fontSize: '0.6em', verticalAlign: 'sub' }}
                >
                  {segment.slice(5, -6)}
                </sub>
              );
            }

            if (segment.startsWith('<') && segment.includes('</')) {
              const tagMatch = segment.match(/^<(\w+)>([^<]*)<\/\1>$/);
              if (tagMatch) {
                const [, tag, content] = tagMatch;
                switch (tag.toLowerCase()) {
                  case 'em':
                  case 'i':
                    return (
                      <em
                        key={segIndex}
                        className="italic text-indigo-600 dark:text-indigo-400 font-medium"
                      >
                        {content}
                      </em>
                    );
                  case 'u':
                    return (
                      <u
                        key={segIndex}
                        className="underline text-indigo-600 dark:text-indigo-400"
                      >
                        {content}
                      </u>
                    );
                  case 'mark':
                    return (
                      <mark
                        key={segIndex}
                        className="bg-yellow-200 dark:bg-yellow-800/60 text-gray-900 dark:text-yellow-100 px-1 rounded"
                      >
                        {content}
                      </mark>
                    );
                  case 'small':
                    return (
                      <small
                        key={segIndex}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {content}
                      </small>
                    );
                  default:
                    return (
                      <span
                        key={segIndex}
                        className="text-indigo-600 dark:text-indigo-400 font-medium"
                      >
                        {content}
                      </span>
                    );
                }
              }
            }
            
            return (
              <span key={segIndex}>
                {segment.split('\n').map((line, lineIndex, array) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < array.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            );
          })}
        </div>
      );
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group mb-3 sm:mb-4`}>
      <div
        className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
          isUser
            ? 'bg-indigo-600 dark:bg-indigo-700 text-white shadow-md'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm'
        }`}
      >
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-indigo-500 dark:bg-indigo-600' : 'bg-indigo-100 dark:bg-indigo-900'
          }`}>
            {isUser ? (
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full" />
            ) : (
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`text-xs sm:text-sm leading-relaxed break-words ${
              isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'
            }`}>
              {isUser ? (
                <span className="whitespace-pre-wrap">{message.content}</span>
              ) : (
                <div className="space-y-2">
                  {formatContent(message.content)}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-opacity-20 border-gray-300 dark:border-gray-600">
              <span className={`text-[10px] sm:text-xs ${
                isUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChatInterface({ 
  enrollmentId, 
  enrolledCourse, 
  conversationId,
  onConversationChange 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!conversationId) return;

    setIsLoadingMessages(true);
    setError(null);
    try {
      const response = await fetch(`/api/assistant/chat?conversationId=${conversationId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages || []);
      } else {
        setError('Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      messageId: `temp-${Date.now()}`,
      conversationId: conversationId || '',
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationId,
          enrollmentId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!conversationId && data.conversationId) {
          onConversationChange(data.conversationId);
        }

        setMessages(prev => [
          ...prev.slice(0, -1),
          { ...userMessage, id: `user-${Date.now()}`, conversationId: data.conversationId },
          data.message
        ]);
      } else {
        setMessages(prev => prev.slice(0, -1));
        setError(data.error || 'Failed to send message');
      }
    } catch (error) {
      setMessages(prev => prev.slice(0, -1));
      setError('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const retryLastMessage = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      if (lastUserMessage) {
        setInputMessage(lastUserMessage.content);
        setError(null);
      }
    }
  };

  const quickSuggestions = [
    "What should I study next?",
    "Explain this concept",
    "Show me my progress",
    "Help with practice problems"
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="border-b border-gray-100 dark:border-gray-800 p-3 sm:p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">{enrolledCourse.courses.name}</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Progress: <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {Math.round((enrolledCourse.enrollCourse.completedChapters?.length || 0) / enrolledCourse.courses.noOfChapters * 100)}%
                </span> • AI Assistant
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800 px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
            <button
              onClick={retryLastMessage}
              className="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors ml-2"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {isLoadingMessages ? (
          <div className="flex justify-center py-6 sm:py-8">
            <div className="text-center">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-indigo-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Loading conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center px-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Hi! I&apos;m your personal learning assistant
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
              I know about your progress in <strong className="text-indigo-700 dark:text-indigo-400">{enrolledCourse.courses.name}</strong> and can help you with:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-lg mx-auto text-xs sm:text-sm mb-4 sm:mb-6">
              <div className="bg-indigo-50 dark:bg-indigo-950/50 rounded-lg p-2.5 sm:p-3 text-left border border-indigo-100 dark:border-indigo-800">
                <strong className="text-indigo-900 dark:text-indigo-300 text-xs sm:text-sm">Course Content</strong>
                <p className="text-indigo-700 dark:text-indigo-400 text-[10px] sm:text-xs">Explanations, concept clarification</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-2.5 sm:p-3 text-left border border-blue-100 dark:border-blue-800">
                <strong className="text-blue-900 dark:text-blue-300 text-xs sm:text-sm">Progress Guidance</strong>
                <p className="text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs">Next steps and recommendations</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/50 rounded-lg p-2.5 sm:p-3 text-left border border-green-100 dark:border-green-800">
                <strong className="text-green-900 dark:text-green-300 text-xs sm:text-sm">Study Support</strong>
                <p className="text-green-700 dark:text-green-400 text-[10px] sm:text-xs">Quiz prep and review help</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/50 rounded-lg p-2.5 sm:p-3 text-left border border-orange-100 dark:border-orange-800">
                <strong className="text-orange-900 dark:text-orange-300 text-xs sm:text-sm">Learning Path</strong>
                <p className="text-orange-700 dark:text-orange-400 text-[10px] sm:text-xs">Personalized study suggestions</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <EnhancedMessageBubble
              key={message.id || message.messageId || index}
              message={message}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 p-3 sm:p-4 bg-white dark:bg-[#09090b]">
        <div className="flex space-x-2 sm:space-x-3 -mb-6">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your course progress..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-20 sm:pr-24 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full ring-2 ring-indigo-500 dark:ring-indigo-400 transition-all text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
              Enter to send
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 sm:p-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}