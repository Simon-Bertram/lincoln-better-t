'use client';

import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { CivilWarOrphan } from '@/components/civil-war-orphans-columns';
import type { Student } from '@/components/columns';
import { DataTable } from '@/components/data-table/data-table';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Enhanced types for better type safety
export interface DataSectionConfig<T extends Student | CivilWarOrphan> {
  queryKey: string;
  queryFn: () => Promise<T[]>;
  columns: ColumnDef<T>[];
  mobileColumns: ColumnDef<T>[];
  messages: {
    empty: string;
    error: string;
    loading: string;
  };
  // Optional configuration
  options?: {
    retry?: boolean | number;
    staleTime?: number;
    gcTime?: number;
  };
}

// Enhanced props interface
export interface EnhancedDataSectionProps<T extends Student | CivilWarOrphan> {
  config: DataSectionConfig<T>;
  className?: string;
  showMobileTable?: boolean;
  showDesktopTable?: boolean;
}

// Loading state component with better accessibility
interface LoadingStateProps {
  message: string;
  className?: string;
}

function LoadingState({ message, className }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className || ''}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <div
          aria-label="Loading"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          role="status"
        />
        <span>{message}</span>
      </div>
    </div>
  );
}

// Enhanced error state with better error handling
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  className?: string;
  error?: Error;
}

function ErrorState({ message, onRetry, className, error }: ErrorStateProps) {
  return (
    <Card className={`mx-auto max-w-md ${className || ''}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-lg">Failed to load data</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {process.env.NODE_ENV === 'development' && error && (
          <div className="rounded-md bg-muted p-3">
            <details>
              <summary className="cursor-pointer font-medium text-sm">
                Error Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-muted-foreground text-xs">
                {error.message}
              </pre>
            </details>
          </div>
        )}
        <Button className="w-full" onClick={onRetry} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

// Enhanced empty state
interface EmptyStateProps {
  message: string;
  className?: string;
}

function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={`py-8 text-center text-muted-foreground ${className || ''}`}
    >
      <p>{message}</p>
    </div>
  );
}

// Main enhanced data section component
export function EnhancedDataSection<T extends Student | CivilWarOrphan>({
  config,
  className,
  showMobileTable = true,
  showDesktopTable = true,
}: EnhancedDataSectionProps<T>) {
  const {
    queryKey,
    queryFn,
    columns,
    mobileColumns,
    messages,
    options = {},
  } = config;

  const query = useQuery({
    queryKey: [queryKey],
    queryFn,
    retry: options.retry ?? 3, // Can be boolean or number of retries
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options.gcTime ?? 10 * 60 * 1000, // 10 minutes
  });

  if (query.isLoading) {
    return <LoadingState className={className} message={messages.loading} />;
  }

  if (query.error) {
    return (
      <ErrorState
        className={className}
        error={query.error as Error}
        message={messages.error}
        onRetry={query.refetch}
      />
    );
  }

  if (!query.data?.length) {
    return <EmptyState className={className} message={messages.empty} />;
  }

  return (
    <div className={className}>
      {showDesktopTable && (
        <div className="hidden lg:block">
          <DataTable columns={columns} data={query.data} />
        </div>
      )}
      {showMobileTable && (
        <div className="block lg:hidden">
          <MobileDataTable data={query.data} mobileColumns={mobileColumns} />
        </div>
      )}
    </div>
  );
}

// Factory function to create data section configurations
export function createDataSectionConfig<T extends Student | CivilWarOrphan>(
  config: DataSectionConfig<T>
): DataSectionConfig<T> {
  return {
    ...config,
    options: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      ...config.options,
    },
  };
}
