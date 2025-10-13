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
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-[#FFFFFF] border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Bot className="w-5 h-5 text-purple-600" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">Assistant Chat</h3>
            <p className="text-xs text-gray-600 truncate">{courseName}</p>
          </div>
        </div>
        
        <button
          onClick={createNewConversation}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors font-medium"
        >
          <span>New Chat</span>
        </button>
      </div>

      <div className="p-3 bg-[#FFFFFF] border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#FFFFFF] rounded-lg p-3 border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center">
            {searchQuery ? (
              <div>
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">No conversations found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            ) : conversations.length === 0 ? (
              <div>
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500 mb-1">No conversations yet</p>
                <p className="text-xs text-gray-400">Start a new chat to get help with your course</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                className={`group flex items-start p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                  activeConversationId === conversation.conversationId
                    ? 'bg-purple-100 border-purple-200 shadow-sm'
                    : 'bg-[#FFFFFF] hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
                onClick={() => onConversationSelect(conversation.conversationId)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 ${
                  activeConversationId === conversation.conversationId
                    ? 'bg-purple-200'
                    : 'bg-gray-100 group-hover:bg-purple-100'
                }`}>
                  <MessageSquare className={`w-4 h-4 ${
                    activeConversationId === conversation.conversationId
                      ? 'text-purple-700'
                      : 'text-gray-500 group-hover:text-purple-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-medium truncate mb-1 ${
                    activeConversationId === conversation.conversationId
                      ? 'text-purple-900'
                      : 'text-gray-900'
                  }`}>
                    {conversation.title}
                  </h4>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-500 truncate">
                      {formatDate(conversation.lastMessageAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => deleteConversation(conversation.conversationId, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all ml-2"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}