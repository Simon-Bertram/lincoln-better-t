'use client';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { orpc } from '@/utils/orpc';

const TITLE_TEXT = `Lincoln School Directory
 `;

export default function Home() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  const studentsQuery = useQuery(orpc.getStudents.queryOptions());

  return (
    <div className="container mx-auto max-w-6xl px-4 py-2">
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
            <Table>
              <TableCaption>
                A list of students from the Lincoln Institute.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Indian Name</TableHead>
                  <TableHead>Family Name</TableHead>
                  <TableHead>English Name</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead>Year of Birth</TableHead>
                  <TableHead>Nation</TableHead>
                  <TableHead>Arrival Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsQuery.data.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.indianName || '-'}</TableCell>
                    <TableCell>{student.familyName || '-'}</TableCell>
                    <TableCell>{student.englishGivenName || '-'}</TableCell>
                    <TableCell>{student.sex || '-'}</TableCell>
                    <TableCell>{student.yearOfBirth || '-'}</TableCell>
                    <TableCell>{student.nation || '-'}</TableCell>
                    <TableCell>
                      {student.arrivalAtLincoln
                        ? new Date(
                            student.arrivalAtLincoln
                          ).toLocaleDateString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
