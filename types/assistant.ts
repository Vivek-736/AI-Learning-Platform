/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Message {
  id: string;
  messageId: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokenCount?: number;
  metadata?: any;
}

export interface Conversation {
  id: string;
  conversationId: string;
  enrollmentId: number;
  userEmail: string;
  title: string;
  isActive: boolean;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrolledCourse {
  courses: {
    id: number;
    cid: string;
    name: string;
    description: string;
    noOfChapters: number;
    includeVideo: boolean;
    level: string;
    category: string;
    courseJson: any;
    bannerImageUrl: string;
    courseContent: any;
    userEmail: string;
  };
  enrollCourse: {
    id: number;
    cid: string;
    userEmail: string;
    completedChapters: any;
  };
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  enrollmentId: number;
}

export interface ChatResponse {
  message: Message;
  conversationId: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface EnrollmentContext {
  enrollmentId: number;
  courseId: string;
  courseName: string;
  courseDescription: string;
  courseContent: any;
  completedChapters: any[];
  level: string;
  category: string;
  enrollmentDate: Date;
  progressPercentage: number;
  userQuizzes?: any[];
  userFlashcards?: any[];
}

export interface AssistantState {
  selectedEnrollment: EnrolledCourse | null;
  activeConversationId: string | null;
  conversations: Conversation[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface ContextData {
  type: string;
  data: any;
  updatedAt: string;
}

export interface AssistantContextType {
  enrollmentId: number;
  contextType: string;
  contextData: ContextData;
  embeddings?: any;
  createdAt: Date;
  updatedAt: Date;
}