"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type TableType = "students" | "civil_war_orphans";

const TABLE_TYPES = {
  STUDENTS: "students" as const,
  CIVIL_WAR_ORPHANS: "civil_war_orphans" as const,
} as const;

const DEFAULT_TABLE_TYPE: TableType = TABLE_TYPES.STUDENTS;

/**
 * Hook for parsing table type from URL parameters
 * @returns The current table type from URL or default
 */
function useTableTypeFromURL(): TableType {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const tableParam = searchParams.get("table");
    return (tableParam as TableType) || DEFAULT_TABLE_TYPE;
  }, [searchParams]);
}

/**
 * Hook for handling table navigation and URL updates
 * @returns Functions for updating table type in URL
 */
function useTableNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Updates the URL with the specified table type
   * @param newTableType - The table type to set in the URL
   */
  const updateTableTypeInURL = useCallback(
    (newTableType: TableType) => {
      const params = new URLSearchParams(searchParams);

      if (newTableType === DEFAULT_TABLE_TYPE) {
        // Remove the param if it's the default
        params.delete("table");
      } else {
        // Set the param for non-default values
        params.set("table", newTableType);
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      router.push(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return { updateTableTypeInURL };
}

/**
 * Main hook that combines URL parsing and navigation functionality
 * @returns Complete table toggle functionality
 */
export function useTableToggle() {
  const currentTableType = useTableTypeFromURL();
  const { updateTableTypeInURL } = useTableNavigation();

  /**
   * Switches to a specific table type
   * @param tableType - The table type to switch to
   */
  const switchToTable = useCallback(
    (tableType: TableType) => {
      updateTableTypeInURL(tableType);
    },
    [updateTableTypeInURL]
  );

  /**
   * Toggles between the two available table types
   */
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
