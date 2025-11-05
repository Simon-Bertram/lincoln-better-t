"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableBody } from "@/components/data-table/data-table-body";
import { DataTableFilterBar } from "@/components/data-table/data-table-filter-bar";
import { DataTableHead } from "@/components/data-table/data-table-head";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { Table, TableCaption } from "@/components/ui/table";
import { useTableState } from "@/hooks/use-table-state";

// Pagination options moved to PaginationControls

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const {
    table,
    uniqueNations,
    globalFilter,
    nationFilter,
    getSortDirection,
    setNationFilter,
  } = useTableState({
    data,
    columns,
  });

  return (
    <div className="w-full">
      <DataTableFilterBar
        globalFilter={globalFilter}
        nationFilter={nationFilter}
        setNationFilterAction={setNationFilter}
        table={table}
        uniqueNations={uniqueNations}
      />
      <Table aria-label="Student directory records" id="student-table">
        <TableCaption className="sr-only">
          Student directory records from the Lincoln Institute (1866-1922)
        </TableCaption>
        <DataTableHead
          getSortDirectionAction={getSortDirection}
          table={table}
        />
        <DataTableBody columnsLength={columns.length} table={table} />
      </Table>
      <PaginationControls table={table} />
    </div>
  );
}
