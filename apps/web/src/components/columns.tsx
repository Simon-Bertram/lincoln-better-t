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
    header: 'Indian Name',
    cell: ({ row }) => <div>{row.getValue('indianName') || '-'}</div>,
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('familyName') || '-'}</div>,
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('englishGivenName') || '-'}</div>,
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('nation') || '-'}</div>,
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const departureDate = row.getValue('departureFromLincoln') as string | null;
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
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                  Source
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Source</h4>
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
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                  Comments
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Comments</h4>
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
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                  Relevant Links
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Relevant Links</h4>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
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
