import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const lessons = pgTable('lessons', {
  id: varchar('id', { length: 255 }).primaryKey(),
  courseId: varchar('courseId', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  videoUrl: varchar('videoUrl', { length: 255 }).notNull(),
  duration: integer('duration').notNull(),
  order: integer('order').notNull(),
  isFreePreview: boolean('isFreePreview').notNull().default(false),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
});

export type LessonRow = typeof lessons.$inferSelect;
