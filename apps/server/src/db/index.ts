import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { students } from './migrations/schema';

const schema = { students };

const sql = neon(process.env.DATABASE_URL ?? '');
const db = drizzle(sql, { schema });

export { db, schema };
