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

export const flashcardProgressTable = pgTable("flashcardProgress", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    progressId: varchar().notNull().unique(),
    flashcardSetId: varchar('flashcardSetId').references(() => flashcardSetsTable.fid).notNull(),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    masteredCards: json().default([]),
    reviewCards: json().default([]),
    lastStudied: timestamp().defaultNow(),
    studySessions: integer().default(0),
    totalTimeSpent: integer().default(0)
});

export const interviewsTable = pgTable("interviews", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    iid: varchar().notNull().unique(),
    title: varchar().notNull(),
    type: varchar().notNull(),
    courseId: varchar('courseId').references(() => coursesTable.cid),
    customTopic: varchar(),
    questions: json().notNull(),
    difficulty: varchar().default('medium'),
    duration: integer().default(30),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

export const interviewAttemptsTable = pgTable("interviewAttempts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    attemptId: varchar().notNull().unique(),
    interviewId: varchar('interviewId').references(() => interviewsTable.iid).notNull(),
    userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
    vapiCallId: varchar(),
    responses: json(),
    overallScore: integer(),
    feedback: text(),
    duration: integer(),
    status: varchar().default('pending'),
    completedAt: timestamp().defaultNow()
});