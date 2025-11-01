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
                  className="px-2 py-1 bg-gray-100 text-purple-700 rounded font-mono text-sm border"
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
                  className="font-semibold text-purple-700 bg-purple-50 px-1 py-0.5 rounded"
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
                  className="text-xs font-medium text-purple-600"
                  style={{ fontSize: '0.6em', verticalAlign: 'super' }}
                >
                  {segment.slice(5, -6)}
                </sup>
              );
            }

            // Handle subscript
            if (segment.startsWith('<sub>') && segment.endsWith('</sub>')) {
              return (
                <sub
                  key={segIndex}
                  className="text-xs font-medium text-purple-600"
                  style={{ fontSize: '0.6em', verticalAlign: 'sub' }}
                >
                  {segment.slice(5, -6)}
                </sub>
              );
            }

            // Handle other HTML tags (em, strong, u, etc.)
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
                        className="italic text-purple-600 font-medium"
                      >
                        {content}
                      </em>
                    );
                  case 'u':
                    return (
                      <u
                        key={segIndex}
                        className="underline text-purple-600"
                      >
                        {content}
                      </u>
                    );
                  case 'mark':
                    return (
                      <mark
                        key={segIndex}
                        className="bg-yellow-200 text-gray-900 px-1 rounded"
                      >
                        {content}
                      </mark>
                    );
                  case 'small':
                    return (
                      <small
                        key={segIndex}
                        className="text-sm text-gray-600"
                      >
                        {content}
                      </small>
                    );
                  default:
                    return (
                      <span
                        key={segIndex}
                        className="text-purple-600 font-medium"
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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group mb-4`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-[#FFFFFF] text-gray-900 border border-gray-200 shadow-sm'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-purple-500' : 'bg-purple-100'
          }`}>
            {isUser ? (
              <div className="w-4 h-4 bg-[#FFFFFF] rounded-full" />
            ) : (
              <Bot className="w-4 h-4 text-purple-600" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`text-sm leading-relaxed break-words ${
              isUser ? 'text-white' : 'text-gray-900'
            }`}>
              {isUser ? (
                <span className="whitespace-pre-wrap">{message.content}</span>
              ) : (
                <div className="space-y-2">
                  {formatContent(message.content)}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-opacity-20 border-gray-300">
              <span className={`text-xs ${
                isUser ? 'text-purple-200' : 'text-gray-500'
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
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <div className="border-b border-gray-100 p-4 bg-[#FFFFFF]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{enrolledCourse.courses.name}</h2>
              <p className="text-sm text-gray-500">
                Progress: <span className="font-medium text-purple-600">
                  {Math.round((enrolledCourse.enrollCourse.completedChapters?.length || 0) / enrolledCourse.courses.noOfChapters * 100)}%
                </span> • AI Assistant
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
            <button
              onClick={retryLastMessage}
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hi! I&apos;m your personal learning assistant
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              I know about your progress in <strong className="text-purple-700">{enrolledCourse.courses.name}</strong> and can help you with:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto text-sm mb-6">
              <div className="bg-purple-50 rounded-lg p-3 text-left border border-purple-100">
                <strong className="text-purple-900">Course Content</strong>
                <p className="text-purple-700">Explanations, concept clarification</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-left border border-blue-100">
                <strong className="text-blue-900">Progress Guidance</strong>
                <p className="text-blue-700">Next steps and recommendations</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-left border border-green-100">
                <strong className="text-green-900">Study Support</strong>
                <p className="text-green-700">Quiz prep and review help</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-left border border-orange-100">
                <strong className="text-orange-900">Learning Path</strong>
                <p className="text-orange-700">Personalized study suggestions</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-colors"
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
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 p-4 bg-[#FFFFFF]">
        <div className="flex space-x-3 -mb-6">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your course progress..."
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-full ring-2 ring-purple-500 transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              Enter to send
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}