import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

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

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'indianName',
    header: 'Tribal Name',
    cell: ({ row }) => <div>{row.getValue('indianName') || '-'}</div>,
    enableGlobalFilter: true,
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
    accessorKey: 'englishGivenName',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          English Name
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('englishGivenName') || '-'}</div>,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'sex',
    header: 'Sex',
    cell: ({ row }) => <div>{row.getValue('sex') || '-'}</div>,
  },
  {
    accessorKey: 'yearOfBirth',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Year of Birth
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('yearOfBirth') || '-'}</div>,
  },
  {
    accessorKey: 'nation',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Nation
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('nation') || '-'}</div>,
    enableGlobalFilter: false,
  },
  {
    accessorKey: 'arrivalAtLincoln',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Arrival Date
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const arrivalDate = row.getValue('arrivalAtLincoln') as string | null;
      return (
        <div>
          {arrivalDate ? new Date(arrivalDate).toLocaleDateString() : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'departureFromLincoln',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Departure Date
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const departureDate = row.getValue('departureFromLincoln') as
        | string
        | null;
      return (
        <div>
          {departureDate ? new Date(departureDate).toLocaleDateString() : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => {
      const source = row.getValue('source') as string | null;
      return (
        <div>
          {source ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  className="h-auto p-0 p-0 text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
                  variant="link"
                >
                  Source
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Source</h4>
                  <p className="text-sm">{source}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            '-'
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'comments',
    header: 'Comments',
    cell: ({ row }) => {
      const comments = row.getValue('comments') as string | null;
      return (
        <div>
          {comments ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  className="h-auto p-0 p-0 text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
                  variant="link"
                >
                  Comments
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-700 text-sm hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200">
                    Comments
                  </h4>
                  <p className="text-sm">{comments}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            '-'
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'relevantLinks',
    header: 'Relevant Link',
    cell: ({ row }) => {
      const link = row.getValue('relevantLinks') as string | null;
      return (
        <div>
          {link ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  className="h-auto p-0 text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
                  variant="link"
                >
                  Relevant Links
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Relevant Links</h4>
                  <a
                    className="break-all text-sm underline"
                    href={link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link}
                  </a>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            '-'
          )}
        </div>
      );
    },
  },
];

// Mobile-specific columns that show only essential information
export const mobileColumns: ColumnDef<Student>[] = [
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
    accessorKey: 'englishGivenName',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          English Name
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('englishGivenName') || '-'}</div>,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'nation',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Nation
          <ArrowUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4"
            focusable="false"
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('nation') || '-'}</div>,
    enableGlobalFilter: false,
  },
];
