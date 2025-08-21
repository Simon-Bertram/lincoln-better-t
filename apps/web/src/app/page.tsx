'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { columns, mobileColumns, type Student } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { ErrorBoundary } from '@/components/error-boundary';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { orpc } from '@/utils/orpc';

function StudentsSection() {
  const studentsQuery = useQuery(orpc.getStudents.queryOptions());

  if (studentsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading students...</span>
        </div>
      </div>
    );
  }

  if (studentsQuery.error) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-lg">Failed to load students</CardTitle>
          <CardDescription>
            There was an error loading the student data. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => studentsQuery.refetch()}
            variant="default"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!studentsQuery.data || studentsQuery.data.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>No students found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table - hidden on mobile */}
      <div className="hidden lg:block">
        <DataTable columns={columns} data={studentsQuery.data as Student[]} />
      </div>
      {/* Mobile table - visible on mobile */}
      <div className="block lg:hidden">
        <MobileDataTable
          data={studentsQuery.data as Student[]}
          mobileColumns={mobileColumns}
        />
      </div>
    </>
  );
}

export default function Home() {
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
          <ErrorBoundary>
            <StudentsSection />
          </ErrorBoundary>
        </section>
      </div>
    </main>
  );
}
