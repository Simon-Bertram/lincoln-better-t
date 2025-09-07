'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type TableType = 'students' | 'civil_war_orphans';

const TABLE_TYPES = {
  STUDENTS: 'students' as const,
  CIVIL_WAR_ORPHANS: 'civil_war_orphans' as const,
} as const;

const DEFAULT_TABLE_TYPE: TableType = TABLE_TYPES.STUDENTS;

export function useTableToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current table type from URL params
  const currentTableType = useMemo(() => {
    const tableParam = searchParams.get('table');
    return (tableParam as TableType) || DEFAULT_TABLE_TYPE;
  }, [searchParams]);

  // Toggle table type and update URL
  const toggleTableType = useCallback(
    (newTableType: TableType) => {
      const params = new URLSearchParams(searchParams);

      if (newTableType === DEFAULT_TABLE_TYPE) {
        // Remove the param if it's the default
        params.delete('table');
      } else {
        // Set the param for non-default values
        params.set('table', newTableType);
      }

      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

      router.push(newUrl, { scroll: false });
    },
    [router, searchParams]
  );

  // Switch to specific table type
  const switchToTable = useCallback(
    (tableType: TableType) => {
      toggleTableType(tableType);
    },
    [toggleTableType]
  );

  // Toggle between the two table types
  const toggleTable = useCallback(() => {
    const newTableType =
      currentTableType === TABLE_TYPES.STUDENTS
        ? TABLE_TYPES.CIVIL_WAR_ORPHANS
        : TABLE_TYPES.STUDENTS;

    switchToTable(newTableType);
  }, [currentTableType, switchToTable]);

  return {
    currentTableType,
    toggleTable,
    switchToTable,
    isStudentsTable: currentTableType === TABLE_TYPES.STUDENTS,
    isCivilWarOrphansTable: currentTableType === TABLE_TYPES.CIVIL_WAR_ORPHANS,
    TABLE_TYPES,
  };
}
