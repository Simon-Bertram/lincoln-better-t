import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface Student {
  studentId: number;
  indianName: string | null;
  familyName: string | null;
  givenName: string | null;
  sex: string | null;
  birthYear: number | null;
  nation: string | null;
  agency: string | null;
  arrivalDateFull: string | null;
  departureDateFull: string | null;
  trade: string | null;
  diedAtLincoln: boolean | null;
}

/**
 * Creates a sortable header button with arrow icon
 * @param title - The header title text
 * @param column - The column object for sorting functionality
 * @returns JSX element for the sortable header
 */
function createSortableHeader(title: string, column: Column<Student, unknown>) {
  return (
    <Button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      variant="ghost"
    >
      {title}
      <ArrowUpDown
        aria-hidden="true"
        className="ml-2 h-4 w-4"
        focusable="false"
      />
    </Button>
  );
}

/**
 * Creates a cell that displays a value or fallback text
 * @param value - The value to display
 * @param fallback - The fallback text when value is null/undefined
 * @returns JSX element for the cell
 */
function createTextCell(value: unknown, fallback = "-") {
  return <div>{String(value || fallback)}</div>;
}

/**
 * Creates a cell that formats and displays a date
 * @param dateValue - The date value to format
 * @returns JSX element for the date cell
 */
function createDateCell(dateValue: string | null) {
  return (
    <div>{dateValue ? new Date(dateValue).toLocaleDateString() : "-"}</div>
  );
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "studentId",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("studentId")}</div>
    ),
  },
  {
    accessorKey: "indianName",
    header: "Tribal Name",
    cell: ({ row }) => createTextCell(row.getValue("indianName")),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "familyName",
    header: ({ column }) => createSortableHeader("Family Name", column),
    cell: ({ row }) => createTextCell(row.getValue("familyName")),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "givenName",
    header: ({ column }) => createSortableHeader("English Name", column),
    cell: ({ row }) => createTextCell(row.getValue("givenName")),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "sex",
    header: "Sex",
    cell: ({ row }) => createTextCell(row.getValue("sex")),
  },
  {
    accessorKey: "birthYear",
    header: ({ column }) => createSortableHeader("Year of Birth", column),
    cell: ({ row }) => createTextCell(row.getValue("birthYear")),
  },
  {
    accessorKey: "nation",
    header: ({ column }) => createSortableHeader("Nation", column),
    cell: ({ row }) => createTextCell(row.getValue("nation")),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "agency",
    header: ({ column }) => createSortableHeader("Agency", column),
    cell: ({ row }) => createTextCell(row.getValue("agency")),
  },
  {
    accessorKey: "arrivalDateFull",
    header: ({ column }) => createSortableHeader("Arrival Date", column),
    cell: ({ row }) =>
      createDateCell(row.getValue("arrivalDateFull") as string | null),
  },
  {
    accessorKey: "departureDateFull",
    header: ({ column }) => createSortableHeader("Departure Date", column),
    cell: ({ row }) =>
      createDateCell(row.getValue("departureDateFull") as string | null),
  },
  {
    accessorKey: "trade",
    header: "Trade",
    cell: ({ row }) => createTextCell(row.getValue("trade")),
  },
  {
    accessorKey: "diedAtLincoln",
    header: "Died At Lincoln",
    cell: ({ row }) => {
      const value = row.getValue("diedAtLincoln") as boolean | null;
      if (value === null) {
        return <div>-</div>;
      }
      return <div>{value ? "Yes" : "No"}</div>;
    },
  },
];

// Mobile-specific columns that show only essential information
export const mobileColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "familyName",
    header: ({ column }) => createSortableHeader("Family Name", column),
    cell: ({ row }) => createTextCell(row.getValue("familyName")),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "givenName",
    header: ({ column }) => createSortableHeader("English Name", column),
    cell: ({ row }) => createTextCell(row.getValue("givenName")),
    enableGlobalFilter: true,
  },
];
