'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {motion} from 'framer-motion'

export interface DataFormat {
  id: string;
  name: string;
  amount: number;
}

const ActionCell = ({ row }: { row: Row<DataFormat> }) => {
    const token = row.original;
    console.log(token);
  return (
    <div className="flex justify-end gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-blue-500 hover:text-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-destructive hover:text-destructive/90"
      >
        <Trash2 className="h-4 w-4" />
      </motion.button>
    </div>
  );
};

export const columns: ColumnDef<DataFormat>[] = [
  {
    accessorKey: 'id',
    header: 'Sr No.',
    cell: ({ row }) => {
      return <div className="text-left">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return (
        <div className="flex items-center">
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Amount (₹)
        <ArrowUpDown className="ml-2 h-4 w-4 text-left" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return <div className="text-left">₹{amount.toLocaleString('en-IN')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
