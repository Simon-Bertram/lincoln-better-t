import { z } from "zod";
import {
	fetchAgenciesByIds,
	fetchAllAgencies,
	fetchAllEnrollments,
	fetchAllNations,
	fetchEnrollmentsByStudentIds,
	fetchNationsByIds,
	fetchStudents,
} from "../repositories/students-repository";
import {
	sanitizeOffset,
	sanitizeSearchInput,
} from "./shared/query-sanitization";
import { StudentEntitySchema, StudentTableRowSchema } from "../types/student";

interface GetStudentsInput {
	search?: string;
	offset?: number;
	limit?: number;
}

const SECURITY_LIMITS = {
	MAX_OFFSET: 10_000,
	MAX_SEARCH_LENGTH: 200,
	MAX_LIMIT: 100,
} as const;

function sanitizeLimit(limit: number | undefined): number | undefined {
	if (typeof limit !== "number" || limit <= 0) {
		return undefined;
	}
	return Math.min(limit, SECURITY_LIMITS.MAX_LIMIT);
}

function formatStudentsError(error: unknown): never {
	throw new Error(
		`Failed to fetch students: ${
			error instanceof Error ? error.message : "Unknown error"
		}`,
	);
}

export async function getStudents(input?: GetStudentsInput) {
	try {
		const sanitizedInput = {
			search: input?.search
				? sanitizeSearchInput(input.search, {
						maxSearchLength: SECURITY_LIMITS.MAX_SEARCH_LENGTH,
					})
				: undefined,
			offset: sanitizeOffset(input?.offset, {
				maxOffset: SECURITY_LIMITS.MAX_OFFSET,
			}),
			limit: sanitizeLimit(input?.limit),
		};

		const studentRows = await fetchStudents(sanitizedInput);
		const validatedStudents = z.array(StudentEntitySchema).parse(studentRows);

		if (!validatedStudents.length) {
			return [];
		}

		const studentIds = validatedStudents.map((student) => student.studentId);
		const nationIds = validatedStudents
			.map((student) => student.nationId)
			.filter((id): id is number => typeof id === "number");
		const agencyIds = validatedStudents
			.map((student) => student.agencyId)
			.filter((id): id is number => typeof id === "number");

		const [nationRows, agencyRows, enrollmentRows] = await Promise.all([
			fetchNationsByIds(nationIds),
			fetchAgenciesByIds(agencyIds),
			fetchEnrollmentsByStudentIds(studentIds),
		]);

		const nationById = new Map(
			nationRows.map((row) => [row.nationId, row.nation]),
		);
		const agencyById = new Map(
			agencyRows.map((row) => [row.agencyId, row.agency]),
		);
		const enrollmentByStudentId = new Map<number, (typeof enrollmentRows)[number]>();

		for (const enrollment of enrollmentRows) {
			if (enrollment.studentId === null) {
				continue;
			}
			const existing = enrollmentByStudentId.get(enrollment.studentId);
			if (!existing) {
				enrollmentByStudentId.set(enrollment.studentId, enrollment);
				continue;
			}

			const existingDepartureYear =
				existing.departureYearNumeric ?? Number.MIN_SAFE_INTEGER;
			const nextDepartureYear =
				enrollment.departureYearNumeric ?? Number.MIN_SAFE_INTEGER;
			const existingArrivalYear =
				existing.arrivalYearNumeric ?? Number.MIN_SAFE_INTEGER;
			const nextArrivalYear =
				enrollment.arrivalYearNumeric ?? Number.MIN_SAFE_INTEGER;

			const shouldReplace =
				nextDepartureYear > existingDepartureYear ||
				(nextDepartureYear === existingDepartureYear &&
					nextArrivalYear > existingArrivalYear);

			if (shouldReplace) {
				enrollmentByStudentId.set(enrollment.studentId, enrollment);
			}
		}

		const result = validatedStudents.map((student) => {
			const enrollment = enrollmentByStudentId.get(student.studentId);
			return {
				studentId: student.studentId,
				familyName: student.familyName,
				givenName: student.givenName,
				indianName: student.indianName,
				sex: student.sex,
				birthYear: student.birthYear,
				nation:
					student.nationId === null ? null : (nationById.get(student.nationId) ?? null),
				agency:
					student.agencyId === null ? null : (agencyById.get(student.agencyId) ?? null),
				arrivalDateFull: enrollment?.arrivalDateFull ?? null,
				departureDateFull: enrollment?.departureDateFull ?? null,
				trade: enrollment?.trade ?? null,
				diedAtLincoln: enrollment?.diedAtLincoln ?? null,
			};
		});

		return z.array(StudentTableRowSchema).parse(result);
	} catch (error) {
		return formatStudentsError(error);
	}
}

export function getNations() {
	return fetchAllNations();
}

export function getAgencies() {
	return fetchAllAgencies();
}

export function getEnrollments() {
	return fetchAllEnrollments();
}
