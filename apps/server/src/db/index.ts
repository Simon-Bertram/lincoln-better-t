import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { agencies, civilWarOrphans, enrollments, nations, students } from "./schema";

const schema = { students, civilWarOrphans, nations, agencies, enrollments };

const sql = neon(process.env.DATABASE_URL ?? "");
const db = drizzle(sql, { schema });

export { db, schema };
