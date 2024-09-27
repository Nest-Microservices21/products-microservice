import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema/**.schema.ts',
  dialect: "sqlite",
  out:"./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    
  },
  verbose: true,
  strict:true
});