'use client';

import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { CivilWarOrphan } from '@/components/civil-war-orphans-columns';
import type { Student } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Types for the generic data section
export type DataSectionProps<T extends Student | CivilWarOrphan> = {
  queryKey: string;
  queryFnAction: () => Promise<T[]>;
  columns: ColumnDef<T>[];
  mobileColumns: ColumnDef<T>[];
  emptyMessage: string;
  errorMessage: string;
  loadingMessage: string;
};

// Loading state component
type LoadingStateProps = {
  message: string;
};

function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span>{message}</span>
      </div>
    </div>
  );
}

// Error state component
type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-lg">Failed to load data</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={onRetry} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

// Empty state component
type EmptyStateProps = {
  message: string;
};

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="py-8 text-center text-muted-foreground">
      <p>{message}</p>
    </div>
  );
}

// Main generic data section component
export function DataSection<T extends Student | CivilWarOrphan>({
  queryKey,
  queryFnAction,
  columns,
  mobileColumns,
  emptyMessage,
  errorMessage,
  loadingMessage,
}: DataSectionProps<T>) {
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: queryFnAction,
  });

  if (query.isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (query.error) {
    return <ErrorState message={errorMessage} onRetry={query.refetch} />;
  }

  if (!query.data?.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <>
      {/* Desktop table - hidden on mobile */}
      <div className="hidden lg:block">
        <DataTable columns={columns} data={query.data} />
      </div>
      {/* Mobile table - visible on mobile */}
      <div className="block lg:hidden">
        <MobileDataTable data={query.data} mobileColumns={mobileColumns} />
      </div>
    </>
  );
}
