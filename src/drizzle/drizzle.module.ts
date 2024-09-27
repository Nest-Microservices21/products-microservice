import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Database from 'better-sqlite3';
import {  drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema/schema';
export const DRIZZLE = Symbol('drizzle-connection');
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseURL = configService.get<string>('DATABASE_URL');
        const sqlite = new Database(databaseURL);
        const db = drizzle(sqlite, { schema });
        return db
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
