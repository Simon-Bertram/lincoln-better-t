import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

export type CivilWarOrphan = {
  id: number;
  familyName: string | null;
  givenName: string | null;
  aliases: string | null;
  birthDate: string | null;
  arrival: string | null;
  departure: string | null;
  scholarships: string | null;
  assignments: string | null;
  situation1878: string | null;
  assignmentScholarshipYear: string | null;
  references: string | null;
  comments: string | null;
};

export const civilWarOrphansColumns: ColumnDef<CivilWarOrphan>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'familyName',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Family Name
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('familyName') || '-'}</div>,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'givenName',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Given Name
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('givenName') || '-'}</div>,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'birthDate',
    header: 'Birth Date',
    cell: ({ row }) => <div>{row.getValue('birthDate') || '-'}</div>,
  },
  {
    accessorKey: 'arrival',
    header: 'Arrival',
    cell: ({ row }) => <div>{row.getValue('arrival') || '-'}</div>,
  },
  {
    accessorKey: 'departure',
    header: 'Departure',
    cell: ({ row }) => <div>{row.getValue('departure') || '-'}</div>,
  },
  {
    accessorKey: 'scholarships',
    header: 'Scholarships',
    cell: ({ row }) => <div>{row.getValue('scholarships') || '-'}</div>,
  },
  {
    accessorKey: 'assignments',
    header: 'Assignments',
    cell: ({ row }) => <div>{row.getValue('assignments') || '-'}</div>,
  },
];

// Mobile-specific columns for civil war orphans
export const civilWarOrphansMobileColumns: ColumnDef<CivilWarOrphan>[] = [
  {
    accessorKey: 'familyName',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Family Name
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('familyName') || '-'}</div>,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'givenName',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Given Name
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('givenName') || '-'}</div>,
    enableGlobalFilter: true,
  },
];
