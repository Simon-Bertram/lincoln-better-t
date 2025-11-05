"use client";

import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// ============================================================================
// NameFilter Component
// ============================================================================
// Purpose: Handles text-based filtering for student names
// Benefits:
// - Single Responsibility: Only handles name filtering logic
// - Reusability: Can be used independently in other parts of the app
// - Testability: Easier to test in isolation
// - Maintainability: Changes to name filter don't affect nation filter

type NameFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

function NameFilter({ value, onChange }: NameFilterProps) {
  return (
    <div className="relative max-w-sm">
      <label className="sr-only" htmlFor="student-filter">
        Filter students
      </label>
      <Input
        aria-describedby="student-filter-help"
        className="pr-8"
        id="student-filter"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Filter by name..."
        value={value}
      />
      {value && (
        <Button
          aria-label="Clear search"
          className="-translate-y-1/2 absolute top-1/2 right-1 h-6 w-6 p-0"
          onClick={() => onChange("")}
          size="sm"
          variant="ghost"
        >
          <X aria-hidden="true" className="h-4 w-4" focusable="false" />
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// NationFilter Component
// ============================================================================
// Purpose: Handles dropdown-based filtering for nations
// Benefits:
// - Encapsulation: All nation filter UI and logic in one place
// - Conditional Rendering: Only renders when nations are available
// - Type Safety: Clear props interface for what it needs

type NationFilterProps = {
  nations: string[];
  selectedNation: string | null;
  onNationChange: (value: string | null) => void;
};

function NationFilter({
  nations,
  selectedNation,
  onNationChange,
}: NationFilterProps) {
  // Early return pattern: Don't render if no nations available
  if (nations.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-4" variant="outline">
          {selectedNation || "Filter by Nation"}
          <ChevronDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onNationChange(null)}>
          All Nations
        </DropdownMenuItem>
        {nations.map((nation) => (
          <DropdownMenuItem key={nation} onClick={() => onNationChange(nation)}>
            {nation}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// FilterBar Component (Composition)
// ============================================================================
// Purpose: Composes NameFilter and NationFilter into a cohesive filter bar
// Benefits:
// - Composition over Inheritance: Combines smaller, focused components
// - Cleaner API: FilterBar handles coordination, components handle details
// - Flexibility: Easy to reorder, add, or remove filters

type FilterBarProps = {
  globalFilter: string;
  onGlobalFilterChangeAction: (value: string) => void;
  uniqueNations: string[];
  nationFilter: string | null;
  onNationFilterChangeAction: (value: string | null) => void;
  showNationFilter?: boolean;
};

export function FilterBar({
  globalFilter,
  onGlobalFilterChangeAction,
  uniqueNations,
  nationFilter,
  onNationFilterChangeAction,
  showNationFilter = true,
}: FilterBarProps) {
  return (
    <div className="flex items-center py-4">
      <NameFilter value={globalFilter} onChange={onGlobalFilterChangeAction} />
      {showNationFilter && (
        <NationFilter
          nations={uniqueNations}
          selectedNation={nationFilter}
          onNationChange={onNationFilterChangeAction}
        />
      )}
    </div>
  );
}
