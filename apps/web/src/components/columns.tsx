import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type Student = {
  id: number;
  indianName: string | null;
  familyName: string | null;
  englishGivenName: string | null;
  sex: string | null;
  yearOfBirth: number | null;
  nation: string | null;
  arrivalAtLincoln: string | null;
  departureFromLincoln: string | null;
  source: string | null;
  comments: string | null;
  relevantLinks: string | null;
};

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

/**
 * Creates a hover card cell for displaying long text content
 * @param content - The content to display in the hover card
 * @param title - The title for the hover card trigger
 * @param isLink - Whether the content should be rendered as a link
 * @returns JSX element for the hover card cell
 */
function createHoverCardCell(
  content: string | null,
  title: string,
  isLink = false
) {
  if (!content) {
    return <div>-</div>;
  }

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            className="h-auto p-0 text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
            variant="link"
          >
            {title}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{title}</h4>
            {isLink ? (
              <a
                className="break-all text-sm underline"
                href={content}
                rel="noopener noreferrer"
                target="_blank"
              >
                {content}
              </a>
            ) : (
              <p className="text-sm">{content}</p>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
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
    accessorKey: "englishGivenName",
    header: ({ column }) => createSortableHeader("English Name", column),
    cell: ({ row }) => createTextCell(row.getValue("englishGivenName")),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "sex",
    header: "Sex",
    cell: ({ row }) => createTextCell(row.getValue("sex")),
  },
  {
    accessorKey: "yearOfBirth",
    header: ({ column }) => createSortableHeader("Year of Birth", column),
    cell: ({ row }) => createTextCell(row.getValue("yearOfBirth")),
  },
  {
    accessorKey: "nation",
    header: ({ column }) => createSortableHeader("Nation", column),
    cell: ({ row }) => createTextCell(row.getValue("nation")),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "arrivalAtLincoln",
    header: ({ column }) => createSortableHeader("Arrival Date", column),
    cell: ({ row }) =>
      createDateCell(row.getValue("arrivalAtLincoln") as string | null),
  },
  {
    accessorKey: "departureFromLincoln",
    header: ({ column }) => createSortableHeader("Departure Date", column),
    cell: ({ row }) =>
      createDateCell(row.getValue("departureFromLincoln") as string | null),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) =>
      createHoverCardCell(row.getValue("source") as string | null, "Source"),
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) =>
      createHoverCardCell(
        row.getValue("comments") as string | null,
        "Comments"
      ),
  },
  {
    accessorKey: "relevantLinks",
    header: "Relevant Link",
    cell: ({ row }) =>
      createHoverCardCell(
        row.getValue("relevantLinks") as string | null,
        "Relevant Links",
        true
      ),
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
    accessorKey: "englishGivenName",
    header: ({ column }) => createSortableHeader("English Name", column),
    cell: ({ row }) => createTextCell(row.getValue("englishGivenName")),
    enableGlobalFilter: true,
  },
];
