'use client';

import type { Column, Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type DataTableHeadProps<TData> = {
  table: Table<TData>;
  getSortDirectionAction: (
    column: Column<TData, unknown>
  ) => 'ascending' | 'descending' | 'none';
};

export function DataTableHead<TData>({
  table,
  getSortDirectionAction,
}: DataTableHeadProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                aria-sort={getSortDirectionAction(header.column)}
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
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
