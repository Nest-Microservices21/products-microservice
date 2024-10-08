import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();
if (!process.env.DATABASE_URL) {
  console.log(process.env.DATABASE_URL);
  throw new Error('DATABASE_URL is not defined in .env file');
}
export default defineConfig({
  schema: './src/drizzle/schema/**.schema.ts',
  dialect: 'sqlite',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
