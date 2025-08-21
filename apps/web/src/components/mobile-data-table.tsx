'use client';

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import React, { useState } from 'react';
import type { Student } from '@/components/columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PAGE_SIZE_OPTIONS = [10, 20, 25, 30, 40, 50] as const;

type MobileDataTableProps = {
  mobileColumns: ColumnDef<Student>[];
  data: Student[];
};

export function MobileDataTable({ mobileColumns, data }: MobileDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const table = useReactTable({
    data,
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
    globalFilterFn: 'includesString',
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

  // Function to render additional details for a row
  const renderRowDetails = (student: Student) => {
    return (
      <div className="space-y-3 rounded-lg bg-muted/50 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">
              Tribal Name:
            </span>
            <p className="mt-1">{student.indianName || '-'}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Sex:</span>
            <p className="mt-1">{student.sex || '-'}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">
              Year of Birth:
            </span>
            <p className="mt-1">{student.yearOfBirth || '-'}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">
              Arrival Date:
            </span>
            <p className="mt-1">
              {student.arrivalAtLincoln
                ? new Date(student.arrivalAtLincoln).toLocaleDateString()
                : '-'}
            </p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">
              Departure Date:
            </span>
            <p className="mt-1">
              {student.departureFromLincoln
                ? new Date(student.departureFromLincoln).toLocaleDateString()
                : '-'}
            </p>
          </div>
        </div>

        {student.source && (
          <div>
            <span className="font-medium text-muted-foreground">Source:</span>
            <p className="mt-1 text-sm">{student.source}</p>
          </div>
        )}

        {student.comments && (
          <div>
            <span className="font-medium text-muted-foreground">Comments:</span>
            <p className="mt-1 text-sm">{student.comments}</p>
          </div>
        )}

        {student.relevantLinks && (
          <div>
            <span className="font-medium text-muted-foreground">
              Relevant Links:
            </span>
            <a
              className="mt-1 block text-blue-600 text-sm underline hover:text-blue-800"
              href={student.relevantLinks}
              rel="noopener noreferrer"
              target="_blank"
            >
              {student.relevantLinks}
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          className="max-w-sm"
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          placeholder="Filter by name..."
          value={globalFilter}
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableCaption>
            Student directory records from the Lincoln Institute (1866-1922)
          </TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                    <TableRow data-state={row.getIsSelected() && 'selected'}>
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
                          className="h-8 w-8 p-0"
                          onClick={() => toggleRowExpansion(row.id)}
                          size="sm"
                          variant="ghost"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4" />
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
                          {renderRowDetails(row.original)}
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
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-sm">Rows per page</p>
            <Select
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              value={`${table.getState().pagination.pageSize}`}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZE_OPTIONS.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center font-medium text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="hidden h-8 w-8 lg:flex"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              className="hidden h-8 w-8 lg:flex"
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
