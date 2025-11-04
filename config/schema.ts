import { boolean, integer, json, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    subscriptionId: varchar()
});

export const coursesTable = pgTable("courses", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    cid: varchar().notNull().unique(),
    name: varchar(),
    description: varchar(),
    noOfChapters: integer().notNull(),
    includeVideo: boolean().default(false),
    level: varchar().notNull(),
    category: varchar(),
    courseJson: json(),
    bannerImageUrl: varchar().default(""),
    courseContent: json().default({}),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull()
});

export const enrollCourseTable = pgTable("enrollCourse", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    cid: varchar('cid').references(() => coursesTable.cid).notNull(),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    completedChapters: json(),
})

export const quizzesTable = pgTable("quizzes", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    qid: varchar().notNull().unique(),
    title: varchar().notNull(),
    description: text(),
    courseId: varchar('courseId').references(() => coursesTable.cid),
    customTopic: varchar(),
    questions: json().notNull(),
    totalQuestions: integer().notNull(),
    difficulty: varchar().default('medium'),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

export const quizAttemptsTable = pgTable("quizAttempts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    attemptId: varchar().notNull().unique(),
    quizId: varchar('quizId').references(() => quizzesTable.qid).notNull(),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    answers: json().notNull(),
    score: integer().notNull(),
    totalQuestions: integer().notNull(),
    percentage: integer().notNull(),
    timeSpent: integer(),
    completedAt: timestamp().defaultNow()
});

export const flashcardSetsTable = pgTable("flashcardSets", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fid: varchar().notNull().unique(),
    title: varchar().notNull(),
    description: text(),
    courseId: varchar('courseId').references(() => coursesTable.cid),
    customTopic: varchar(),
    flashcards: json().notNull(),
    totalCards: integer().notNull(),
    difficulty: varchar().default('medium'),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

export const interviewTemplatesTable = pgTable("interviewTemplates", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    templateId: varchar().notNull().unique(),
    title: varchar().notNull(),
    description: text(),
    courseId: varchar('courseId').references(() => coursesTable.cid).notNull(),
    creatorEmail: varchar('creatorEmail').references(() => usersTable.email).notNull(),
    difficulty: varchar().default('medium'),
    estimatedDuration: integer().default(15),
    questions: json().notNull(),
    skillsToAssess: json().notNull(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

export const interviewLinksTable = pgTable("interviewLinks", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    linkId: varchar().notNull().unique(),
    templateId: varchar('templateId').references(() => interviewTemplatesTable.templateId).notNull(),
    createdBy: varchar('createdBy').references(() => usersTable.email).notNull(),
    title: varchar().notNull(),
    instructions: text(),
    expiresAt: timestamp(),
    maxAttempts: integer(),
    isActive: boolean().default(true),
    allowAnonymous: boolean().default(true),
    createdAt: timestamp().defaultNow()
});

export const interviewSessionsTable = pgTable("interviewSessions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sessionId: varchar().notNull().unique(),
    linkId: varchar('linkId').references(() => interviewLinksTable.linkId).notNull(),
    templateId: varchar('templateId').references(() => interviewTemplatesTable.templateId).notNull(),
    candidateName: varchar().notNull(),
    candidateEmail: varchar().notNull(),
    candidatePhone: varchar(),
    status: varchar().default('pending'),
    startedAt: timestamp(),
    completedAt: timestamp(),
    duration: integer(),
    conversationTranscript: json(),
    audioRecordingUrl: varchar(),
    overallScore: integer(),
    skillScores: json(),
    detailedFeedback: json(),
    strengths: json(),
    improvements: json(),
    recommendations: json(),
    ipAddress: varchar(),
    userAgent: text(),
    createdAt: timestamp().defaultNow()
});

export const assistantConversationsTable = pgTable("assistantConversations", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    conversationId: varchar().notNull().unique(),
    enrollmentId: integer('enrollmentId').references(() => enrollCourseTable.id).notNull(),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    title: varchar().default("New Conversation"),
    isActive: boolean().default(true),
    lastMessageAt: timestamp().defaultNow(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

export const assistantMessagesTable = pgTable("assistantMessages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    messageId: varchar().notNull().unique(),
    conversationId: varchar('conversationId').references(() => assistantConversationsTable.conversationId).notNull(),
    role: varchar().notNull(),
    content: text().notNull(),
    timestamp: timestamp().defaultNow(),
    tokenCount: integer(),
    metadata: json()
});

export const userXpTable = pgTable("userXp", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull().unique(),
    totalXp: integer().default(0).notNull(),
    courseCompletionXp: integer().default(0).notNull(),
    quizXp: integer().default(0).notNull(),
    interviewXp: integer().default(0).notNull(),
    flashcardXp: integer().default(0).notNull(),
    lastUpdated: timestamp().defaultNow(),
    createdAt: timestamp().defaultNow()
});

export const codingChallengesTable = pgTable("codingChallenges", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    challengeId: varchar().notNull().unique(),
    title: varchar().notNull(),
    description: text(),
    testType: varchar().notNull(),
    topic: varchar(),
    difficulty: varchar().notNull(),
    timeLimit: integer().notNull().default(60),
    totalProblems: integer().notNull().default(4),
    problems: json().notNull(),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

export const codingAttemptsTable = pgTable("codingAttempts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    attemptId: varchar().notNull().unique(),
    challengeId: varchar('challengeId').references(() => codingChallengesTable.challengeId).notNull(),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    startedAt: timestamp().defaultNow(),
    submittedAt: timestamp(),
    timeSpent: integer(),
    status: varchar().default('in-progress'),
    solutions: json(),
    totalScore: integer().default(0),
    problemsAttempted: integer().default(0),
    problemsSolved: integer().default(0),
    testCasesPassed: integer().default(0),
    testCasesFailed: integer().default(0),
    feedback: json(),
    createdAt: timestamp().defaultNow()
});

export const codingProblemsTable = pgTable("codingProblems", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    problemId: varchar().notNull().unique(),
    title: varchar().notNull(),
    description: text().notNull(),
    topic: varchar().notNull(),
    difficulty: varchar().notNull(),
    constraints: text(),
    inputFormat: text(),
    outputFormat: text(),
    sampleInput: text(),
    sampleOutput: text(),
    explanation: text(),
    testCases: json().notNull(),
    hints: json(),
    tags: json(),
    timeComplexity: varchar(),
    spaceComplexity: varchar(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});