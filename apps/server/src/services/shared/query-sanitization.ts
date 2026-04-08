const DEFAULT_MAX_SEARCH_LENGTH = 200
const DEFAULT_MAX_OFFSET = 10_000

interface QuerySanitizationOptions {
	maxSearchLength?: number
	maxOffset?: number
}

export function sanitizeSearchInput(
	search: string,
	options?: QuerySanitizationOptions,
): string {
	const maxSearchLength = options?.maxSearchLength ?? DEFAULT_MAX_SEARCH_LENGTH

	if (!search || typeof search !== "string") {
		return ""
	}

	return search
		.replace(/[%_\\]/g, "")
		.replace(/[<>'"&]/g, "")
		.replace(/[;()]/g, "")
		.trim()
		.slice(0, maxSearchLength)
}

export function sanitizeOffset(
	offset: number | undefined,
	options?: QuerySanitizationOptions,
): number {
	const maxOffset = options?.maxOffset ?? DEFAULT_MAX_OFFSET

	if (typeof offset !== "number" || offset < 0 || !Number.isInteger(offset)) {
		return 0
	}

	return Math.min(offset, maxOffset)
}
