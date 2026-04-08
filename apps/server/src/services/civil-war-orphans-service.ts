import { z } from "zod";
import {
	fetchCivilWarOrphans,
} from "../repositories/civil-war-orphans-repository";
import {
	sanitizeOffset,
	sanitizeSearchInput,
} from "./shared/query-sanitization";
import { CivilWarOrphanSchema } from "../types/civil-war-orphans";

interface GetCivilWarOrphansInput {
	search?: string;
	offset?: number;
}

const SECURITY_LIMITS = {
	MAX_OFFSET: 10_000,
	MAX_SEARCH_LENGTH: 200,
} as const;

function formatCivilWarOrphansError(error: unknown): never {
	throw new Error(
		`Failed to fetch civil war orphans: ${
			error instanceof Error ? error.message : "Unknown error"
		}`,
	);
}

export async function getCivilWarOrphans(input?: GetCivilWarOrphansInput) {
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
		};
		const result = await fetchCivilWarOrphans(sanitizedInput);
		return z.array(CivilWarOrphanSchema).parse(result);
	} catch (error) {
		return formatCivilWarOrphansError(error);
	}
}
