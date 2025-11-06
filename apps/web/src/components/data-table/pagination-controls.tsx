"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [10, 20, 25, 30, 40, 50] as const;

export type PaginationControlsProps<TData> = {
  table: Table<TData>;
  tableId?: string;
};

export function PaginationControls<TData>({
  table,
  tableId = "data-table",
}: PaginationControlsProps<TData>) {
  const rowsPerPageLabelId = `${tableId}-rows-per-page-label`;
  const rowsPerPageTriggerId = `${tableId}-rows-per-page-trigger`;
  const tableIdValue = tableId ? `${tableId}-table` : "data-table";

  return (
    <nav
      aria-controls={tableIdValue}
      aria-label="Table pagination"
      className="flex items-center justify-between p-4"
    >
      <div className="flex-1 text-muted-foreground text-sm">
        Showing {table.getRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s).
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="font-medium text-sm" id={rowsPerPageLabelId}>
            Rows per page
          </p>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            value={`${table.getState().pagination.pageSize}`}
          >
            <SelectTrigger
              aria-labelledby={`${rowsPerPageLabelId} ${rowsPerPageTriggerId}`}
              className="h-8 w-[70px]"
              id={rowsPerPageTriggerId}
            >
              <SelectValue
                placeholder={String(table.getState().pagination.pageSize)}
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
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            className="hidden h-8 w-8 lg:flex"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            size="icon"
            type="button"
            variant="outline"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft
              aria-hidden="true"
              className="h-4 w-4"
              focusable="false"
            />
          </Button>
          <Button
            aria-label="Go to previous page"
            className="h-8 w-8"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="icon"
            type="button"
            variant="outline"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft
              aria-hidden="true"
              className="h-4 w-4"
              focusable="false"
            />
          </Button>
          <Button
            aria-label="Go to next page"
            className="h-8 w-8"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="icon"
            type="button"
            variant="outline"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight
              aria-hidden="true"
              className="h-4 w-4"
              focusable="false"
            />
          </Button>
          <Button
            aria-label="Go to last page"
            className="hidden h-8 w-8 lg:flex"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            size="icon"
            type="button"
            variant="outline"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight
              aria-hidden="true"
              className="h-4 w-4"
              focusable="false"
            />
          </Button>
        </div>
      </div>
    </nav>
  );
}
