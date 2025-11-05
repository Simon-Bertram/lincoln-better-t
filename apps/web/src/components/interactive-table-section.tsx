"use client";

import {
	type CivilWarOrphan,
	civilWarOrphansColumns,
	civilWarOrphansMobileColumns,
} from "@/components/civil-war-orphans-columns";
import { columns, mobileColumns, type Student } from "@/components/columns";
import { DataSection } from "@/components/data-section";
import { ErrorBoundary } from "@/components/error-boundary";
import { TableToggle } from "@/components/table-toggle";
import { useTableToggle } from "@/hooks/use-table-toggle";
import { MESSAGES } from "@/lib/constants";

// Students section using the generic DataSection component
function StudentsSection() {
	return (
		<DataSection<Student>
			columns={columns}
			emptyMessage={MESSAGES.EMPTY.STUDENTS}
			errorMessage={MESSAGES.ERROR.STUDENTS}
			loadingMessage={MESSAGES.LOADING.STUDENTS}
			mobileColumns={mobileColumns}
			queryFnAction={async () => {
				const { client } = await import("@/utils/orpc");
				return client.getStudents();
			}}
			queryKey="students"
		/>
	);
}

// Civil War Orphans section using the generic DataSection component
function CivilWarOrphansSection() {
	return (
		<DataSection<CivilWarOrphan>
			columns={civilWarOrphansColumns}
			emptyMessage={MESSAGES.EMPTY.CIVIL_WAR_ORPHANS}
			errorMessage={MESSAGES.ERROR.CIVIL_WAR_ORPHANS}
			loadingMessage={MESSAGES.LOADING.CIVIL_WAR_ORPHANS}
			mobileColumns={civilWarOrphansMobileColumns}
			queryFnAction={async () => {
				const { client } = await import("@/utils/orpc");
				return client.getCivilWarOrphans();
			}}
			queryKey="civil-war-orphans"
		/>
	);
}

/**
 * Interactive table section component that handles table switching and data fetching
 * This is a client component because it uses hooks for state management
 */
export function InteractiveTableSection() {
	const { isStudentsTable } = useTableToggle();

	return (
		<section className="my-6 overflow-x-scroll rounded-lg border p-6">
			<h2 className="mb-4 font-medium">
				<TableToggle />
				{isStudentsTable
					? MESSAGES.TITLES.STUDENTS
					: MESSAGES.TITLES.CIVIL_WAR_ORPHANS}
			</h2>
			<ErrorBoundary>
				{isStudentsTable ? (
					<StudentsSection />
				) : (
					<CivilWarOrphansSection />
				)}
			</ErrorBoundary>
		</section>
	);
}

