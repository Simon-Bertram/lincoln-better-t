'use client';

import type { Table } from '@tanstack/react-table';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export type DataTableFilterBarProps<TData> = {
  table: Table<TData>;
  uniqueNations: string[];
  nationFilter: string | null;
  globalFilter: string;
  setNationFilterAction: (value: string | null) => void;
};

export function DataTableFilterBar<TData>({
  table,
  uniqueNations,
  nationFilter,
  globalFilter,
  setNationFilterAction,
}: DataTableFilterBarProps<TData>) {
  return (
    <div className="flex items-center py-4">
      <div className="relative max-w-sm">
        <label className="sr-only" htmlFor="student-filter">
          Filter students
        </label>
        <Input
          aria-describedby="student-filter-help"
          className="pr-8"
          id="student-filter"
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          placeholder="Filter by name..."
          type="search"
          value={globalFilter}
        />
        {globalFilter && (
          <Button
            aria-label="Clear search"
            className="-translate-y-1/2 absolute top-1/2 right-1 h-6 w-6 p-0"
            onClick={() => table.setGlobalFilter('')}
            size="sm"
            variant="ghost"
          >
            <X aria-hidden="true" className="h-4 w-4" focusable="false" />
          </Button>
        )}
      </div>
      <p className="sr-only" id="student-filter-help">
        Filters the student table rows
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-4" variant="outline">
            {nationFilter || 'Filter by Nation'}
            <ChevronDown
              aria-hidden="true"
              className="ml-2 h-4 w-4"
              focusable="false"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem key="__all_nations" onClick={() => setNationFilterAction(null)}>
            All Nations
          </DropdownMenuItem>
          {uniqueNations.map((nation) => (
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
            Columns{' '}
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
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  checked={column.getIsVisible()}
                  className="capitalize"
                  key={column.id}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
