import { pgTable, serial, text, bigint, varchar, timestamp, foreignKey, integer, date, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const drizzleMigrations = pgTable("__drizzle_migrations__", {
	id: serial().primaryKey().notNull(),
	hash: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }),
});

export const civilWarOrphans = pgTable("civil_war_orphans", {
	id: serial().primaryKey().notNull(),
	familyName: varchar("family_name", { length: 200 }),
	givenName: varchar("given_name", { length: 200 }),
	aliases: varchar({ length: 500 }),
	birthDate: varchar("birth_date", { length: 100 }),
	arrival: varchar({ length: 100 }),
	departure: varchar({ length: 100 }),
	scholarships: varchar({ length: 500 }),
	assignments: varchar({ length: 500 }),
	situation1878: varchar("situation_1878", { length: 500 }),
	assignmentScholarshipYear: varchar("assignment_scholarship_year", { length: 100 }),
	references: text(),
	comments: text(),
	birthDateOriginalText: text("birth_date_original_text"),
	birthDateUncertain: varchar("birth_date_uncertain", { length: 10 }),
	birthDateClean: varchar("birth_date_clean", { length: 100 }),
	arrivalOriginalText: text("arrival_original_text"),
	arrivalUncertain: varchar("arrival_uncertain", { length: 10 }),
	arrivalAtLincoln: varchar("arrival_at_lincoln", { length: 100 }),
	departureOriginalText: text("departure_original_text"),
	departureUncertain: varchar("departure_uncertain", { length: 10 }),
	departureAtLincoln: varchar("departure_at_lincoln", { length: 100 }),
	departureFromLincoln: varchar("departure_from_lincoln", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const nations = pgTable("nations", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	nationId: bigint("nation_id", { mode: "number" }).primaryKey().notNull(),
	nation: text(),
	band: text(),
});

export const students = pgTable("students", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	studentId: bigint("student_id", { mode: "number" }).primaryKey().notNull(),
	familyName: text("family_name"),
	givenName: text("given_name"),
	indianName: text("indian_name"),
	sex: text(),
	birthYear: integer("birth_year"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	nationId: bigint("nation_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	agencyId: bigint("agency_id", { mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.nationId],
			foreignColumns: [nations.nationId],
			name: "fk_nation"
		}),
	foreignKey({
			columns: [table.agencyId],
			foreignColumns: [agencies.agencyId],
			name: "fk_agency"
		}),
]);

export const agencies = pgTable("agencies", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	agencyId: bigint("agency_id", { mode: "number" }).primaryKey().notNull(),
	agency: text(),
});

export const enrollments = pgTable("enrollments", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	studentId: bigint("student_id", { mode: "number" }),
	arrivalDateFull: date("arrival_date_full"),
	departureDateFull: date("departure_date_full"),
	arrivalYearNumeric: integer("arrival_year_numeric"),
	departureYearNumeric: integer("departure_year_numeric"),
	lengthOfStayDays: integer("length_of_stay_days"),
	diedAtLincoln: boolean("died_at_lincoln"),
	trade: text(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.studentId],
			name: "fk_student"
		}),
]);
