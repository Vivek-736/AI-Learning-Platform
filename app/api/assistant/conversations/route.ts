import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { assistantConversationsTable } from "@/config/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('enrollmentId');
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID required' },
        { status: 400 }
      );
    }

    const enrollmentIdNum = parseInt(enrollmentId);
    if (isNaN(enrollmentIdNum)) {
      return NextResponse.json(
        { error: 'Invalid enrollment ID format' },
        { status: 400 }
      );
    }

    const conversations = await db
      .select()
      .from(assistantConversationsTable)
      .where(
        and(
          eq(assistantConversationsTable.userEmail, userEmail),
          eq(assistantConversationsTable.enrollmentId, enrollmentIdNum),
          eq(assistantConversationsTable.isActive, true)
        )
      )
      .orderBy(desc(assistantConversationsTable.lastMessageAt));

    return NextResponse.json({ 
      conversations,
      total: conversations.length,
      success: true 
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch conversations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { enrollmentId, title } = await request.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    if (typeof enrollmentId !== 'number' || isNaN(enrollmentId)) {
      return NextResponse.json(
        { error: 'Enrollment ID must be a valid number' },
        { status: 400 }
      );
    }

    const conversationId = nanoid(12);

    const newConversation = await db
      .insert(assistantConversationsTable)
      .values({
        conversationId,
        enrollmentId,
        userEmail,
        title: title || 'New Conversation',
        isActive: true,
        lastMessageAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    if (newConversation.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      conversation: newConversation[0],
      success: true,
      message: 'Conversation created successfully' 
    });

  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { conversationId } = await request.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const result = await db
      .update(assistantConversationsTable)
      .set({ 
        isActive: false, 
        updatedAt: new Date() 
      })
      .where(
        and(
          eq(assistantConversationsTable.conversationId, conversationId),
          eq(assistantConversationsTable.userEmail, userEmail),
          eq(assistantConversationsTable.isActive, true)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Conversation deleted successfully',
      deletedConversation: result[0]
    });

  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { conversationId, title, isActive } = await request.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title must be a non-empty string' },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'isActive must be a boolean' },
          { status: 400 }
        );
      }
      updateData.isActive = isActive;
    }

    const result = await db
      .update(assistantConversationsTable)
      .set(updateData)
      .where(
        and(
          eq(assistantConversationsTable.conversationId, conversationId),
          eq(assistantConversationsTable.userEmail, userEmail)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Conversation updated successfully',
      conversation: result[0]
    });

  } catch (error) {
    console.error('Update conversation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { conversationId } = await request.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const result = await db
      .update(assistantConversationsTable)
      .set({ 
        lastMessageAt: new Date(),
        updatedAt: new Date()
      })
      .where(
        and(
          eq(assistantConversationsTable.conversationId, conversationId),
          eq(assistantConversationsTable.userEmail, userEmail),
          eq(assistantConversationsTable.isActive, true)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found or inactive' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Conversation timestamp updated',
      conversation: result[0]
    });

  } catch (error) {
    console.error('Update conversation timestamp error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update conversation timestamp',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 }
    );
  }
}