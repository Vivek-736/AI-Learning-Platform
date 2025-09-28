'use client';

import React, { useState } from 'react';
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Message } from '@/types/assistant';

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function MessageBubble({ message, isLast = false }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const isUser = message.role === 'user';

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    // console.log(`Feedback for message ${message.id}: ${type}`);
  };

  const formatContent = (content: string) => {
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={index} className="ml-2 mb-1">
            <span className="font-medium text-purple-700">{line.match(/^\d+\./)?.[0]}</span>
            <span className="ml-1">{line.replace(/^\d+\.\s/, '')}</span>
          </div>
        );
      }
      
      if (/^[-•*]\s/.test(line)) {
        return (
          <div key={index} className="flex items-start ml-2 mb-1">
            <span className="text-purple-600 mr-2 mt-1">•</span>
            <span>{line.replace(/^[-•*]\s/, '')}</span>
          </div>
        );
      }
      
      const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.trim()) {
        return (
          <div 
            key={index} 
            className="mb-1"
            dangerouslySetInnerHTML={{ __html: boldText }}
          />
        );
      }
      
      return <br key={index} />;
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group mb-4`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-purple-500' : 'bg-purple-100'
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
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
                <div className="space-y-1">
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
              
              {!isUser && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    title="Copy message"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleFeedback('up')}
                    className={`p-1.5 rounded-full transition-colors ${
                      feedback === 'up' 
                        ? 'bg-green-100 text-green-600' 
                        : 'hover:bg-gray-100 text-gray-400 hover:text-green-600'
                    }`}
                    title="Helpful response"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    onClick={() => handleFeedback('down')}
                    className={`p-1.5 rounded-full transition-colors ${
                      feedback === 'down' 
                        ? 'bg-red-100 text-red-600' 
                        : 'hover:bg-gray-100 text-gray-400 hover:text-red-600'
                    }`}
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {!isUser && feedback && (
        <div className={`ml-2 mt-2 px-2 py-1 rounded-full text-xs font-medium ${
          feedback === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback === 'up' ? '👍 Helpful' : '👎 Not helpful'}
        </div>
      )}
    </div>
  );
}