'use client';
import { useQuery } from '@tanstack/react-query';
import { columns, type Student } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { orpc } from '@/utils/orpc';

const TITLE_TEXT = `Lincoln Institute Directory
 `;

export default function Home() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  const studentsQuery = useQuery(orpc.getStudents.queryOptions());

  return (
    <div className="container mx-auto max-w-8/10 px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-4 font-medium">Students</h2>
          {studentsQuery.isLoading && (
            <div className="py-8 text-center text-muted-foreground">
              Loading students...
            </div>
          )}
          {studentsQuery.error && (
            <div className="py-8 text-center text-red-500">
              Error loading students: {studentsQuery.error.message}
            </div>
          )}
          {studentsQuery.data && (
            <DataTable
              columns={columns}
              data={studentsQuery.data as Student[]}
            />
          )}
        </section>
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck.data ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-muted-foreground text-sm">
              {healthCheck.isLoading && 'Checking...'}
              {!healthCheck.isLoading && healthCheck.data && 'Connected'}
              {!(healthCheck.isLoading || healthCheck.data) && 'Disconnected'}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
