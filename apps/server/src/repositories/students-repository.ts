import { inArray, like, or } from "drizzle-orm";
import { db } from "../db";
import { agencies, enrollments, nations, students } from "../db/schema";

export interface StudentQueryInput {
	search?: string;
	offset: number;
	limit?: number;
}

export function fetchStudents(input: StudentQueryInput) {
	const { search, offset, limit } = input;
	const whereClause = search
		? or(
				like(students.familyName, `%${search}%`),
				like(students.givenName, `%${search}%`),
				like(students.indianName, `%${search}%`),
			)
		: undefined;

	const baseQuery = db.select().from(students).offset(offset);

	if (whereClause) {
		if (typeof limit === "number") {
			return baseQuery.where(whereClause).limit(limit);
		}
		return baseQuery.where(whereClause);
	}

	if (typeof limit === "number") {
		return baseQuery.limit(limit);
	}

	return baseQuery;
}

export function fetchNationsByIds(nationIds: number[]) {
	if (!nationIds.length) {
		return Promise.resolve([]);
	}

	return db
		.select({
			nationId: nations.nationId,
			nation: nations.nation,
		})
		.from(nations)
		.where(inArray(nations.nationId, nationIds));
}

export function fetchAgenciesByIds(agencyIds: number[]) {
	if (!agencyIds.length) {
		return Promise.resolve([]);
	}

	return db
		.select({
			agencyId: agencies.agencyId,
			agency: agencies.agency,
		})
		.from(agencies)
		.where(inArray(agencies.agencyId, agencyIds));
}

export function fetchEnrollmentsByStudentIds(studentIds: number[]) {
	return db
		.select({
			studentId: enrollments.studentId,
			arrivalDateFull: enrollments.arrivalDateFull,
			departureDateFull: enrollments.departureDateFull,
			arrivalYearNumeric: enrollments.arrivalYearNumeric,
			departureYearNumeric: enrollments.departureYearNumeric,
			trade: enrollments.trade,
			diedAtLincoln: enrollments.diedAtLincoln,
		})
		.from(enrollments)
		.where(inArray(enrollments.studentId, studentIds));
}

export function fetchAllNations() {
	return db.select().from(nations);
}

export function fetchAllAgencies() {
	return db.select().from(agencies);
}

export function fetchAllEnrollments() {
	return db.select().from(enrollments);
}
