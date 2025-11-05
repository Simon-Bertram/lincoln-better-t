'use client';

import { ChevronDown, X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

type FilterBarProps = {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  uniqueNations: string[];
  nationFilter: string | null;
  onNationFilterChange: (value: string | null) => void;
};

export function FilterBar({
  globalFilter,
  onGlobalFilterChange,
  uniqueNations,
  nationFilter,
  onNationFilterChange,
}: FilterBarProps) {
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
          onChange={(event) => onGlobalFilterChange(event.target.value)}
          placeholder="Filter by name..."
          value={globalFilter}
        />
        {globalFilter && (
          <Button
            aria-label="Clear search"
            className="-translate-y-1/2 absolute top-1/2 right-1 h-6 w-6 p-0"
            onClick={() => onGlobalFilterChange('')}
            size="sm"
            variant="ghost"
          >
            <X aria-hidden="true" className="h-4 w-4" focusable="false" />
          </Button>
        )}
      </div>
      {uniqueNations.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-4" variant="outline">
              {nationFilter || 'Filter by Nation'}
              <ChevronDown aria-hidden="true" className="ml-2 h-4 w-4" focusable="false" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onNationFilterChange(null)}>
              All Nations
            </DropdownMenuItem>
            {uniqueNations.map((nation) => (
              <DropdownMenuItem key={nation} onClick={() => onNationFilterChange(nation)}>
                {nation}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}


