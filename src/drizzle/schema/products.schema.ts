import { sql } from 'drizzle-orm';
import {
  text,
  integer,
  sqliteTable,
  numeric,
  index,
} from 'drizzle-orm/sqlite-core';
export const products = sqliteTable(
  'products',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    price: numeric('price').$type<number>().notNull(),
    available: integer('available', { mode: 'boolean' }).default(true).notNull(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
      availableIndex: index('available_index').on(table.available)
    })
  );
