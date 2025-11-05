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
  tableId?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  tableId,
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
        tableId={tableId}
        uniqueNations={uniqueNations}
      />
      <Table
        aria-label="Directory records"
        id={tableId ? `${tableId}-table` : "data-table"}
      >
        <TableCaption className="sr-only">
          Directory records from the Lincoln Institute (1866-1922)
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
