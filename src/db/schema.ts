import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  department: text("department").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  mistakes: integer("mistakes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const attemptAnswers = pgTable("attempt_answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id")
    .notNull()
    .references(() => attempts.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  chosenIndex: integer("chosen_index").notNull(),
  isCorrect: boolean("is_correct").notNull(),
});

export const courseProgress = pgTable("course_progress", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  department: text("department").notNull(),
  completedCourseIds: jsonb("completed_course_ids")
    .notNull()
    .$type<string[]>()
    .default([]),
  answers: jsonb("answers")
    .notNull()
    .$type<Record<string, { questionId: string; chosenIndex: number }[]>>()
    .default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;
export type AttemptAnswer = typeof attemptAnswers.$inferSelect;
export type NewAttemptAnswer = typeof attemptAnswers.$inferInsert;
export type CourseProgress = typeof courseProgress.$inferSelect;
export type NewCourseProgress = typeof courseProgress.$inferInsert;
