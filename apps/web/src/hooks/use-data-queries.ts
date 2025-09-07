import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import type { CivilWarOrphan } from '@/components/civil-war-orphans-columns';
import type { Student } from '@/components/columns';
import { QUERY_KEYS } from '@/lib/constants';
import { client } from '@/utils/orpc';

/**
 * Custom hook for students data fetching
 */
export function useStudentsQuery() {
  return useMemo(
    () => ({
      queryKey: [QUERY_KEYS.STUDENTS],
      queryFn: () => client.getStudents(),
    }),
    []
  );
}

/**
 * Custom hook for civil war orphans data fetching
 */
export function useCivilWarOrphansQuery() {
  return useMemo(
    () => ({
      queryKey: [QUERY_KEYS.CIVIL_WAR_ORPHANS],
      queryFn: () => client.getCivilWarOrphans(),
    }),
    []
  );
}

/**
 * Type-safe data configuration for different table types
 */
export type DataConfig<T> = {
  queryKey: string[];
  queryFn: () => Promise<T[]>;
  columns: ColumnDef<T>[];
  mobileColumns: ColumnDef<T>[];
  emptyMessage: string;
  errorMessage: string;
  loadingMessage: string;
};

/**
 * Hook to get data configuration for students
 */
export function useStudentsConfig(): DataConfig<Student> {
  const studentsQuery = useStudentsQuery();

  return useMemo(
    () => ({
      ...studentsQuery,
      columns: [], // Will be imported from columns.tsx
      mobileColumns: [], // Will be imported from columns.tsx
      emptyMessage: 'No students found.',
      errorMessage:
        'There was an error loading the student data. Please try again.',
      loadingMessage: 'Loading students...',
    }),
    [studentsQuery]
  );
}

/**
 * Hook to get data configuration for civil war orphans
 */
export function useCivilWarOrphansConfig(): DataConfig<CivilWarOrphan> {
  const orphansQuery = useCivilWarOrphansQuery();

  return useMemo(
    () => ({
      ...orphansQuery,
      columns: [], // Will be imported from civil-war-orphans-columns.tsx
      mobileColumns: [], // Will be imported from civil-war-orphans-columns.tsx
      emptyMessage: 'No civil war orphans found.',
      errorMessage:
        'There was an error loading the civil war orphans data. Please try again.',
      loadingMessage: 'Loading civil war orphans...',
    }),
    [orphansQuery]
  );
}
