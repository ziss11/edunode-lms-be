import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const authentications = pgTable('authentications', {
  id: varchar('id', { length: 255 }).primaryKey(),
  token: varchar('token', { length: 255 }).notNull(),
  userId: varchar('userId', { length: 255 }).notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull(),
});

export type AuthenticationRow = typeof authentications.$inferSelect;
