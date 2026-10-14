// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const workspace = sqliteTable('workspace', { user: text('user').primaryKey(), value: text('value').notNull(), updated: text('updated').notNull() });
export const records = sqliteTable('records', { id: text('id').primaryKey(), domain: text('domain').notNull(), provider: text('provider').notNull(), value: text('value').notNull(), retrieved: text('retrieved').notNull() });
export const history = sqliteTable('history', { id: text('id').primaryKey(), recordId: text('record_id').notNull(), value: text('value').notNull(), observed: text('observed').notNull() });
export const runs = sqliteTable('runs', { provider: text('provider').primaryKey(), value: text('value').notNull() });
