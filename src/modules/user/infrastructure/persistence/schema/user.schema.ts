import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const roles = pgEnum('roles', ['admin', 'instructor', 'student']);

export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  role: roles('role').notNull().default('student'),
  isActive: varchar('isActive', { length: 10 }).notNull().default('true'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
});

export type UserRow = typeof users.$inferSelect;
