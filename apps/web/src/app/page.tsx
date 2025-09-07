'use client';

import { Users } from 'lucide-react';
import {
  type CivilWarOrphan,
  civilWarOrphansColumns,
  civilWarOrphansMobileColumns,
} from '@/components/civil-war-orphans-columns';
import { columns, mobileColumns, type Student } from '@/components/columns';
import { DataSection } from '@/components/data-section';
import { ErrorBoundary } from '@/components/error-boundary';
import { TableToggle } from '@/components/table-toggle';
import { useTableToggle } from '@/hooks/use-table-toggle';
import { MESSAGES } from '@/lib/constants';

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
        const { client } = await import('@/utils/orpc');
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
        const { client } = await import('@/utils/orpc');
        return client.getCivilWarOrphans();
      }}
      queryKey="civil-war-orphans"
    />
  );
}

export default function Home() {
  const { isStudentsTable } = useTableToggle();

  return (
    <main
      className="container mx-auto my-4 w-[95%] px-4 py-2 lg:max-w-8/10"
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
          The Lincoln Institute Directory
        </h1>
        <div className="prose prose-lg mx-auto max-w-3xl space-y-4 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            The Lincoln Institute was a charity created by Mary McHenry Cox
            which operated from 1866 to 1922 at 808 South Eleventh Street in
            Philadelphia.
          </p>
          <p>
            This digital directory contains historical records of students who
            attended the Lincoln Institute during its years of operation. The
            data provides valuable insights into the educational opportunities
            and experiences of students during this period in American history.
          </p>
        </div>
      </section>

      <div className="grid gap-6">
        <section className="my-6 rounded-lg border p-6">
          <h2 className="mb-4 font-medium">
            <TableToggle />
            {isStudentsTable
              ? MESSAGES.TITLES.STUDENTS
              : MESSAGES.TITLES.CIVIL_WAR_ORPHANS}
          </h2>
          <ErrorBoundary>
            {isStudentsTable ? <StudentsSection /> : <CivilWarOrphansSection />}
          </ErrorBoundary>
        </section>
      </div>
    </main>
  );
}
