import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { assistantConversationsTable, assistantMessagesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { geminiAssistant } from "@/lib/gemini";
import { assistantContextManager } from "@/lib/assistant-context";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const { message, conversationId, enrollmentId } = await request.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const enrollmentContext = await assistantContextManager.getEnrollmentContext(enrollmentId, userEmail);
    if (!enrollmentContext) {
      return NextResponse.json(
        { error: 'Enrollment not found or access denied' },
        { status: 404 }
      );
    }

    let currentConversationId = conversationId;

    if (!currentConversationId) {
      const newConversationId = nanoid();
      const conversationTitle = await geminiAssistant.generateConversationTitle(message);
      
      await db.insert(assistantConversationsTable).values({
        conversationId: newConversationId,
        enrollmentId,
        userEmail,
        title: conversationTitle,
        isActive: true,
        lastMessageAt: new Date()
      });
      
      currentConversationId = newConversationId;
    }

    const userMessageId = nanoid();
    await db.insert(assistantMessagesTable).values({
      messageId: userMessageId,
      conversationId: currentConversationId,
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    const conversationHistory = await db
      .select()
      .from(assistantMessagesTable)
      .where(eq(assistantMessagesTable.conversationId, currentConversationId))
      .orderBy(assistantMessagesTable.timestamp);

    const geminiMessages = conversationHistory
      .slice(0, -1)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }]
      }));

    geminiMessages.push({
      role: 'user' as const,
      parts: [{ text: message }]
    });

    const aiResponse = await geminiAssistant.generateResponse(geminiMessages, enrollmentContext);

    const aiMessageId = nanoid();
    await db.insert(assistantMessagesTable).values({
      messageId: aiMessageId,
      conversationId: currentConversationId,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    await db
      .update(assistantConversationsTable)
      .set({ 
        lastMessageAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(assistantConversationsTable.conversationId, currentConversationId));

    return NextResponse.json({
      message: {
        id: aiMessageId,
        messageId: aiMessageId,
        conversationId: currentConversationId,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      },
      conversationId: currentConversationId
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      );
    }

    const messages = await db
      .select()
      .from(assistantMessagesTable)
      .where(eq(assistantMessagesTable.conversationId, conversationId))
      .orderBy(assistantMessagesTable.timestamp);

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}