import type { AppRouterClient } from "../../../server/src/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { CivilWarOrphan } from "@/components/civil-war-orphans-columns";
import type { Student } from "@/components/columns";

/**
 * Server-side ORPC client for data fetching in server components
 * This is separate from the client-side client to avoid hydration issues
 */
function createServerClient(): AppRouterClient {
	const link = new RPCLink({
		url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
	});

	return createORPCClient(link);
}

/**
 * Fetches students data on the server
 * @returns Promise resolving to array of students
 */
export async function getStudentsServer(): Promise<Student[]> {
	try {
		const client = createServerClient();
		return await client.getStudents();
	} catch (error) {
		console.error("Failed to fetch students on server:", error);
		throw error;
	}
}

/**
 * Fetches civil war orphans data on the server
 * @returns Promise resolving to array of civil war orphans
 */
export async function getCivilWarOrphansServer(): Promise<CivilWarOrphan[]> {
	try {
		const client = createServerClient();
		return await client.getCivilWarOrphans();
	} catch (error) {
		console.error("Failed to fetch civil war orphans on server:", error);
		throw error;
	}
}

