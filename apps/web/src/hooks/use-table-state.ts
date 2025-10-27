import type {
  ColumnDef,
  ColumnFiltersState,
  Table as ReactTable,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export type UseTableStateOptions<TData, TValue = unknown> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  enableNationFilter?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnVisibility?: boolean;
  enableRowSelection?: boolean;
};

export type UseTableStateReturn<TData> = {
  table: ReactTable<TData>;
  uniqueNations: string[];
  filteredData: TData[];
  globalFilter: string;
  nationFilter: string | null;
  getSortDirection: (column: {
    getIsSorted: () => string | false;
  }) => 'none' | 'ascending' | 'descending';
  clearFilters: () => void;
  setGlobalFilter: (value: string) => void;
  setNationFilter: (value: string | null) => void;
};

export function useTableState<TData, TValue = unknown>({
  data,
  columns,
  enableNationFilter = true,
  enableGlobalFilter = true,
  enableColumnVisibility = true,
  enableRowSelection = false,
}: UseTableStateOptions<TData, TValue>): UseTableStateReturn<TData> {
  // State management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [nationFilter, setNationFilter] = useState<string | null>(null);

  // Business logic: Extract unique nations from data
  const uniqueNations = useMemo(() => {
    if (!enableNationFilter) {
      return [];
    }

    const nations = (data as Array<{ nation: string | null }>)
      .map((item) => item.nation)
      .filter((nation): nation is string => nation !== null && nation !== '');

    return [...new Set(nations)].sort();
  }, [data, enableNationFilter]);

  // Business logic: Filter data by nation
  const filteredData = useMemo(() => {
    if (!enableNationFilter) {
      return data;
    }

    if (!nationFilter) {
      return data;
    }

    return (data as Array<{ nation: string | null }>).filter(
      (item) => item.nation === nationFilter
    ) as TData[];
  }, [data, nationFilter, enableNationFilter]);

  // Table configuration
  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: enableColumnVisibility
      ? setColumnVisibility
      : undefined,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onGlobalFilterChange: enableGlobalFilter ? setGlobalFilter : undefined,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility: enableColumnVisibility ? columnVisibility : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      globalFilter: enableGlobalFilter ? globalFilter : undefined,
    },
  });

  // Utility function: Get sort direction for accessibility
  const getSortDirection = (column: {
    getIsSorted: () => string | false;
  }): 'none' | 'ascending' | 'descending' => {
    const sortState = column.getIsSorted();
    if (sortState === 'asc') {
      return 'ascending';
    }
    if (sortState === 'desc') {
      return 'descending';
    }
    return 'none';
  };

  // Utility function: Clear all filters
  const clearFilters = () => {
    setGlobalFilter('');
    setNationFilter(null);
    setColumnFilters([]);
  };

  return {
    table,
    uniqueNations,
    filteredData,
    globalFilter,
    nationFilter,
    getSortDirection,
    clearFilters,
    setGlobalFilter,
    setNationFilter,
  };
}
