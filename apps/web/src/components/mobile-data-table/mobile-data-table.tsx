"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight as ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import React, { useMemo, useState } from "react";
import { PAGE_SIZE_OPTIONS } from "@/components/mobile-data-table/constants";
import { FilterBar } from "@/components/mobile-data-table/filter-bar";
import { Pagination } from "@/components/mobile-data-table/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface MobileDataTableOptions<T> {
  getNation?: (record: T) => string | null;
  renderDetails: (record: T) => ReactNode;
}

interface MobileDataTableProps<TData> {
  mobileColumns: ColumnDef<TData>[];
  records: TData[];
  options: MobileDataTableOptions<TData>;
}

export function MobileDataTable<TData>({
  mobileColumns,
  records,
  options,
}: MobileDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [nationFilter, setNationFilter] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const showNationFilter = typeof options.getNation === "function";

  const uniqueNations = useMemo(() => {
    const getNation = options.getNation;
    if (!getNation) {
      return [];
    }
    const nations = records
      .map((item) => getNation(item))
      .filter((nation): nation is string => nation !== null && nation !== "");

    return [...new Set(nations)].sort();
  }, [records, options.getNation]);

  const filteredData = useMemo(() => {
    const getNation = options.getNation;
    if (nationFilter === null || getNation === undefined) {
      return records;
    }
    return records.filter((item) => getNation(item) === nationFilter);
  }, [records, nationFilter, options.getNation]);

  const getSortDirection = (column: { getIsSorted: () => string | false }) => {
    if (column.getIsSorted() === "asc") {
      return "ascending";
    }
    if (column.getIsSorted() === "desc") {
      return "descending";
    }
    return "none";
  };

  const table = useReactTable({
    data: filteredData,
    columns: mobileColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const toggleRowExpansion = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Row details moved to dedicated components

  return (
    <div className="w-full">
      <FilterBar
        globalFilter={globalFilter}
        nationFilter={nationFilter}
        onGlobalFilterChangeAction={(value) => table.setGlobalFilter(value)}
        onNationFilterChangeAction={setNationFilter}
        showNationFilter={showNationFilter}
        uniqueNations={uniqueNations}
      />
      <div className="overflow-hidden rounded-md border">
        <Table aria-label="Student directory records" id="student-table">
          <TableCaption>
            Student directory records from the Lincoln Institute (1866-1922)
          </TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    aria-sort={getSortDirection(header.column)}
                    key={header.id}
                    scope="col"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                <TableHead className="w-12">Details</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isExpanded = expandedRows.has(row.id);
                return (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          aria-label={`Toggle details for row ${row.index + 1}`}
                          className="h-8 w-8 p-0"
                          onClick={() => toggleRowExpansion(row.id)}
                          size="sm"
                          type="button"
                          variant="ghost"
                        >
                          {isExpanded ? (
                            <ChevronDown
                              aria-hidden="true"
                              className="h-4 w-4"
                              focusable="false"
                            />
                          ) : (
                            <ChevronRightIcon
                              aria-hidden="true"
                              className="h-4 w-4"
                              focusable="false"
                            />
                          )}
                          <span className="sr-only">Toggle details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${row.id}-details`}>
                        <TableCell
                          className="p-0"
                          colSpan={row.getVisibleCells().length + 1}
                        >
                          {options.renderDetails(row.original)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={mobileColumns.length + 1}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        table={table}
        tableId="student-table"
      />
    </div>
  );
}
