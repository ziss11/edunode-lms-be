import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const levels = pgEnum('levels', [
  'beginner',
  'intermediate',
  'advanced',
]);

export const courses = pgTable('courses', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  level: levels('level').notNull().default('beginner'),
  instructorId: varchar('instructorId', { length: 255 }).notNull(),
  isPublished: boolean('isPublished').notNull().default(false),
  coverImageUrl: varchar('coverImageUrl', { length: 255 }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
});

export type CourseRow = typeof courses.$inferSelect;
