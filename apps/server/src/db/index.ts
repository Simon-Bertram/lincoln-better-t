import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Placeholder schema - will be replaced after running drizzle-kit introspect
const schema = {};

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export { db, schema };


