'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Clock, Bot, Search } from 'lucide-react';
import { Conversation } from '@/types/assistant';

interface ConversationSidebarProps {
  enrollmentId: number;
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string | null) => void;
  courseName: string;
}

export default function ConversationSidebar({ 
  enrollmentId, 
  activeConversationId, 
  onConversationSelect,
  courseName 
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollmentId]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/assistant/conversations?enrollmentId=${enrollmentId}`);
      const data = await response.json();
      
      if (response.ok) {
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    onConversationSelect(null);
  };

  const deleteConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const response = await fetch('/api/assistant/conversations', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId }),
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.conversationId !== conversationId));
        if (activeConversationId === conversationId) {
          onConversationSelect(null);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#09090b]">
      <div className="p-3 sm:p-4 bg-white dark:bg-[#09090b] border-b border-gray-200 dark:border-none">
        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">Assistant Chat</h3>
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">{courseName}</p>
          </div>
        </div>
        
        <button
          onClick={createNewConversation}
          className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg cursor-pointer hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium text-sm"
        >
          <span>New Chat</span>
        </button>
      </div>

      <div className="p-2 sm:p-3 bg-white dark:bg-[#09090b] border-b border-gray-200 dark:border-none">
        <div className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 sm:p-4">
            <div className="animate-pulse space-y-2 sm:space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1.5 sm:mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-20"></div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 sm:p-6 text-center">
            {searchQuery ? (
              <div>
                <Search className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No conversations found</p>
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>
              </div>
            ) : conversations.length === 0 ? (
              <div>
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">No conversations yet</p>
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">Start a new chat to get help with your course</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="p-1.5 sm:p-2 space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                className={`group flex items-start p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                  activeConversationId === conversation.conversationId
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-700 shadow-sm'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                }`}
                onClick={() => onConversationSelect(conversation.conversationId)}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 sm:mr-3 ${
                  activeConversationId === conversation.conversationId
                    ? 'bg-indigo-200 dark:bg-indigo-800'
                    : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800'
                }`}>
                  <MessageSquare className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    activeConversationId === conversation.conversationId
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs sm:text-sm font-medium truncate mb-0.5 sm:mb-1 ${
                    activeConversationId === conversation.conversationId
                      ? 'text-indigo-900 dark:text-indigo-200'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {conversation.title}
                  </h4>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                      {formatDate(conversation.lastMessageAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => deleteConversation(conversation.conversationId, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all ml-1 sm:ml-2"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}