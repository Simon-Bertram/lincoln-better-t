import { pgTable, index, serial, varchar, char, integer, boolean, text, date, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const students = pgTable("students", {
	id: serial().primaryKey().notNull(),
	censusRecord1900: varchar("census_record_1900", { length: 100 }),
	indianName: varchar("indian_name", { length: 500 }),
	familyName: varchar("family_name", { length: 200 }),
	englishGivenName: varchar("english_given_name", { length: 200 }),
	alias: varchar({ length: 200 }),
	sex: char({ length: 1 }),
	yearOfBirth: integer("year_of_birth"),
	yearOfBirthUncertain: boolean("year_of_birth_uncertain").default(false),
	yearOfBirthUncertaintyType: varchar("year_of_birth_uncertainty_type", { length: 50 }),
	yearOfBirthOriginalText: text("year_of_birth_original_text"),
	arrivalAtLincoln: date("arrival_at_lincoln"),
	arrivalAtLincolnUncertain: boolean("arrival_at_lincoln_uncertain").default(false),
	arrivalAtLincolnUncertaintyType: varchar("arrival_at_lincoln_uncertainty_type", { length: 50 }),
	arrivalAtLincolnOriginalText: text("arrival_at_lincoln_original_text"),
	departureFromLincoln: date("departure_from_lincoln"),
	departureFromLincolnUncertain: boolean("departure_from_lincoln_uncertain").default(false),
	departureFromLincolnUncertaintyType: varchar("departure_from_lincoln_uncertainty_type", { length: 50 }),
	departureFromLincolnOriginalText: text("departure_from_lincoln_original_text"),
	nation: varchar({ length: 200 }),
	band: varchar({ length: 200 }),
	agency: varchar({ length: 200 }),
	trade: varchar({ length: 200 }),
	source: text(),
	comments: text(),
	causeOfDeath: text("cause_of_death"),
	cemeteryBurial: varchar("cemetery_burial", { length: 500 }),
	relevantLinks: text("relevant_links"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_arrival_date").using("btree", table.arrivalAtLincoln.asc().nullsLast().op("date_ops")),
	index("idx_departure_date").using("btree", table.departureFromLincoln.asc().nullsLast().op("date_ops")),
	index("idx_family_name").using("btree", table.familyName.asc().nullsLast().op("text_ops")),
	index("idx_nation").using("btree", table.nation.asc().nullsLast().op("text_ops")),
	index("idx_year_of_birth").using("btree", table.yearOfBirth.asc().nullsLast().op("int4_ops")),
]);
