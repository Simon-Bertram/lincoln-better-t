"use client";

import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export type DataTableBodyProps<TData> = {
  table: Table<TData>;
  columnsLength: number;
};

export function DataTableBody<TData>({
  table,
  columnsLength,
}: DataTableBodyProps<TData>) {
  const isRowSelectionEnabled = table.getState().rowSelection !== undefined;

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            data-state={
              isRowSelectionEnabled && row.getIsSelected() && "selected"
            }
            key={row.id}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            className="h-24 text-center"
            colSpan={Math.max(1, columnsLength)}
          >
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
