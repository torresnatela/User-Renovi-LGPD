import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const requestType = pgEnum('request_type', ['account_deletion']);
export const requestStatus = pgEnum('request_status', [
  'received',
  'in_review',
  'completed',
  'rejected',
  'canceled',
]);
export const deletionScope = pgEnum('deletion_scope', [
  'full_account',
  'specific_data',
]);
export const requestSource = pgEnum('request_source', ['web', 'app_webview']);

export const dsrRequests = pgTable('dsr_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  protocol: varchar('protocol', { length: 20 }).notNull().unique(),
  requestType: requestType('request_type').notNull().default('account_deletion'),

  fullName: varchar('full_name', { length: 200 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  cpf: varchar('cpf', { length: 11 }).notNull(),
  phone: varchar('phone', { length: 20 }),

  deletionScope: deletionScope('deletion_scope').notNull().default('full_account'),
  specificDataDetails: text('specific_data_details'),
  reason: text('reason'),

  status: requestStatus('status').notNull().default('received'),
  internalNotes: text('internal_notes'),

  source: requestSource('source').notNull().default('web'),
  consentConfirmed: boolean('consent_confirmed').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const dsrStatusHistory = pgTable('dsr_status_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestId: uuid('request_id')
    .notNull()
    .references(() => dsrRequests.id),
  fromStatus: requestStatus('from_status'),
  toStatus: requestStatus('to_status').notNull(),
  changedBy: varchar('changed_by', { length: 200 }),
  note: text('note'),
  changedAt: timestamp('changed_at', { withTimezone: true }).notNull().defaultNow(),
});
