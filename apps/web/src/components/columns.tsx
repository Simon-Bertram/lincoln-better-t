import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

export type Student = {
  id: number;
  indianName: string | null;
  familyName: string | null;
  englishGivenName: string | null;
  sex: string | null;
  yearOfBirth: number | null;
  nation: string | null;
  arrivalAtLincoln: string | null;
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
];
