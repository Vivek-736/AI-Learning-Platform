'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Message, Conversation, EnrolledCourse } from '@/types/assistant';

interface AssistantState {
  selectedEnrollment: EnrolledCourse | null;
  activeConversationId: string | null;
  conversations: Conversation[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

type AssistantAction = 
  | { type: 'SET_SELECTED_ENROLLMENT'; payload: EnrolledCourse | null }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string | null }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'REMOVE_CONVERSATION'; payload: string }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };

interface AssistantContextType {
  state: AssistantState;
  dispatch: React.Dispatch<AssistantAction>;
  selectEnrollment: (enrollment: EnrolledCourse | null) => void;
  selectConversation: (conversationId: string | null) => void;
  addMessage: (message: Message) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (conversationId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const initialState: AssistantState = {
  selectedEnrollment: null,
  activeConversationId: null,
  conversations: [],
  messages: [],
  isLoading: false,
  error: null
};

function assistantReducer(state: AssistantState, action: AssistantAction): AssistantState {
  switch (action.type) {
    case 'SET_SELECTED_ENROLLMENT':
      return {
        ...state,
        selectedEnrollment: action.payload,
        activeConversationId: null,
        messages: [],
        conversations: []
      };
    
    case 'SET_ACTIVE_CONVERSATION':
      return {
        ...state,
        activeConversationId: action.payload,
        messages: action.payload ? state.messages : []
      };
    
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload
      };
    
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...state.conversations]
      };
    
    case 'REMOVE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.filter(conv => conv.conversationId !== action.payload),
        activeConversationId: state.activeConversationId === action.payload ? null : state.activeConversationId,
        messages: state.activeConversationId === action.payload ? [] : state.messages
      };
    
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload
      };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

interface AssistantProviderProps {
  children: ReactNode;
}

export function AssistantProvider({ children }: AssistantProviderProps) {
  const [state, dispatch] = useReducer(assistantReducer, initialState);

  const selectEnrollment = (enrollment: EnrolledCourse | null) => {
    dispatch({ type: 'SET_SELECTED_ENROLLMENT', payload: enrollment });
  };

  const selectConversation = (conversationId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
  };

  const addMessage = (message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const addConversation = (conversation: Conversation) => {
    dispatch({ type: 'ADD_CONVERSATION', payload: conversation });
  };

  const removeConversation = (conversationId: string) => {
    dispatch({ type: 'REMOVE_CONVERSATION', payload: conversationId });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const contextValue: AssistantContextType = {
    state,
    dispatch,
    selectEnrollment,
    selectConversation,
    addMessage,
    addConversation,
    removeConversation,
    setLoading,
    setError,
    resetState
  };

  return (
    <AssistantContext.Provider value={contextValue}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}

export { AssistantContext };
