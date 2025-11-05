"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronDown, X } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export type DataTableFilterBarProps<TData> = {
  table: Table<TData>;
  uniqueNations: string[];
  nationFilter: string | null;
  globalFilter: string;
  setNationFilterAction: (value: string | null) => void;
  tableId?: string;
};

export function DataTableFilterBar<TData>({
  table,
  uniqueNations,
  nationFilter,
  globalFilter,
  setNationFilterAction,
  tableId = "table",
}: DataTableFilterBarProps<TData>) {
  const nationOptions = useMemo(
    () => Array.from(new Set(uniqueNations)).filter(Boolean),
    [uniqueNations]
  );
  
  const filterId = `${tableId}-filter`;
  const filterHelpId = `${tableId}-filter-help`;
  
  return (
    <div className="flex items-center py-4">
      <div className="relative max-w-sm">
        <label className="sr-only" htmlFor={filterId}>
          Filter records
        </label>
        <Input
          aria-describedby={filterHelpId}
          className="pr-8"
          id={filterId}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          placeholder="Filter by name..."
          type="search"
          value={globalFilter}
        />
        {globalFilter && (
          <Button
            aria-label="Clear search"
            className="-translate-y-1/2 absolute top-1/2 right-1 h-6 w-6 p-0"
            onClick={() => table.setGlobalFilter("")}
            size="sm"
            variant="ghost"
          >
            <X aria-hidden="true" className="h-4 w-4" focusable="false" />
          </Button>
        )}
      </div>
      <p className="sr-only" id={filterHelpId}>
        Filters the table rows
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-4" variant="outline">
            {nationFilter || "Filter by Nation"}
            <ChevronDown
              aria-hidden="true"
              className="ml-2 h-4 w-4"
              focusable="false"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            key="__all_nations"
            onClick={() => setNationFilterAction(null)}
          >
            All Nations
          </DropdownMenuItem>
          {nationOptions.map((nation) => (
            <DropdownMenuItem
              key={nation}
              onClick={() => setNationFilterAction(nation)}
            >
              {nation}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-auto" variant="outline">
            Columns{" "}
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4"
              focusable="false"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                className="capitalize"
                key={column.id}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
