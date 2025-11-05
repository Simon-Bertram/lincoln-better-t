import { Users } from "lucide-react";
import { InteractiveTableSection } from "@/components/interactive-table-section";
import {
	getCivilWarOrphansServer,
	getStudentsServer,
} from "@/lib/server-data";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";

/**
 * Home page - Server Component
 * 
 * This page is now a server component which provides:
 * - Server-side rendering for better SEO
 * - Faster initial page load
 * - Pre-fetched data for improved performance
 * - Static content rendered on the server
 */
export default async function Home() {
	// Pre-fetch data on the server for both table types
	// This allows React Query to hydrate with server data
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000, // 5 minutes
				gcTime: 10 * 60 * 1000, // 10 minutes
			},
		},
	});

	// Pre-fetch both datasets in parallel for optimal performance
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: [QUERY_KEYS.STUDENTS],
			queryFn: getStudentsServer,
		}),
		queryClient.prefetchQuery({
			queryKey: [QUERY_KEYS.CIVIL_WAR_ORPHANS],
			queryFn: getCivilWarOrphansServer,
		}),
	]);

	return (
		<div className="relative min-h-screen w-full bg-white dark:bg-black">
			{/* Dark mode background */}
			<div
				className="absolute inset-0 z-0 hidden dark:block"
				style={{
					background:
						"radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000",
				}}
			/>
			{/* Light mode background */}
			<div
				className="absolute inset-0 z-0 bg-white dark:hidden"
				style={{
					background:
						"radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.15), transparent 70%), #ffffff",
				}}
			/>

			<main
				className="container relative z-10 mx-auto my-4 w-[95%] px-4 py-2 lg:max-w-8/10"
				id="main-content"
			>
				<section
					aria-labelledby="main-heading"
					className="space-y-6 py-8 text-center"
				>
					<div
						aria-label="Historical records badge"
						className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-medium text-foreground text-sm"
						role="img"
					>
						<Users aria-hidden="true" className="h-4 w-4" />
						Historical Records 1866-1922
					</div>
					<h1
						className="text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text font-bold text-4xl text-transparent md:text-5xl"
						id="main-heading"
					>
						The Lincoln Institution Directory
					</h1>
					<div className="prose prose-lg mx-auto max-w-3xl space-y-4 text-muted-foreground leading-relaxed">
						<p className="text-lg">
							The Lincoln Institution was a charity created by Mary McHenry Cox
							which operated from 1866 to 1922 at 808 South Eleventh Street in
							Philadelphia.
						</p>
						<p>
							This digital directory contains historical records of students who
							attended the Lincoln Institution during its years of operation.
							The data provides valuable insights into the educational
							opportunities and experiences of students during this period in
							American history.
						</p>
					</div>
				</section>

				<div className="grid gap-6">
					{/* Hydrate React Query with server-fetched data */}
					<HydrationBoundary state={dehydrate(queryClient)}>
						<InteractiveTableSection />
					</HydrationBoundary>
				</div>
			</main>
		</div>
	);
}
