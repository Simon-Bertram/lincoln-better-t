'use client';
import { useQuery } from '@tanstack/react-query';
import { columns, mobileColumns, type Student } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { MobileDataTable } from '@/components/mobile-data-table';
import { orpc } from '@/utils/orpc';

export default function Home() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  const studentsQuery = useQuery(orpc.getStudents.queryOptions());

  return (
    <main
      className="container mx-auto my-4 max-w-8/10 px-4 py-2"
      id="main-content"
    >
      <h1 className="mb-6 font-bold text-2xl">
        The Lincoln Institute Directory
      </h1>
      <p>
        The Lincoln Institute was a charity created by Mary McHenry Cox which
        operated from 1866 to 1922 at 808 South Eleventh Street in Philadelphia.
      </p>
      <p>
        This digital directory contains historical records of students who
        attended the Lincoln Institute during its years of operation. The data
        provides valuable insights into the educational opportunities and
        experiences of students during this period in American history.
      </p>
      <div className="grid gap-6">
        <section className="my-6 rounded-lg border p-6">
          <h2 className="mb-4 font-medium">Students</h2>
          {studentsQuery.isLoading && (
            <output
              aria-busy="true"
              aria-live="polite"
              className="block py-8 text-center text-muted-foreground"
            >
              Loading students...
            </output>
          )}
          {studentsQuery.error && (
            <div className="py-8 text-center text-red-500" role="alert">
              Error loading students: {studentsQuery.error.message}
            </div>
          )}
          {studentsQuery.data && (
            <>
              {/* Desktop table - hidden on mobile */}
              <div className="hidden lg:block">
                <DataTable
                  columns={columns}
                  data={studentsQuery.data as Student[]}
                />
              </div>
              {/* Mobile table - visible on mobile */}
              <div className="block lg:hidden">
                <MobileDataTable
                  data={studentsQuery.data as Student[]}
                  mobileColumns={mobileColumns}
                />
              </div>
            </>
          )}
        </section>
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <output aria-live="polite" className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck.data ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-muted-foreground text-sm">
              {healthCheck.isLoading && 'Checking...'}
              {!healthCheck.isLoading && healthCheck.data && 'Connected'}
              {!(healthCheck.isLoading || healthCheck.data) && 'Disconnected'}
            </span>
          </output>
        </section>
      </div>
    </main>
  );
}
