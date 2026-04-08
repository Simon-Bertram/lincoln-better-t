import { like } from "drizzle-orm";
import { db } from "../db";
import { civilWarOrphans } from "../db/schema";

export interface CivilWarOrphansQueryInput {
	search?: string;
	offset: number;
}

export function fetchCivilWarOrphans(input: CivilWarOrphansQueryInput) {
	const { search, offset } = input;
	const whereClause = search
		? like(civilWarOrphans.familyName, `%${search}%`)
		: undefined;

	if (whereClause) {
		return db.select().from(civilWarOrphans).where(whereClause).offset(offset);
	}

	return db.select().from(civilWarOrphans).offset(offset);
}
