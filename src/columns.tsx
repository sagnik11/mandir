'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown, Copy, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';

export interface WorkflowToken {
  id: string;
  keyName: string;
  description?: string;
  expireIn: number;
  createdBy: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  orgId: string;
}


const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={copyToClipboard}
      className="ml-2 p-1 hover:bg-muted rounded-md"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </motion.button>
  );
};

const ActionCell = ({ row }: { row: Row<WorkflowToken> }) => {
  const token = row.original;
console.log(token);
  return (
    <>
      <motion.div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </>
  );
};

export const columns: ColumnDef<WorkflowToken>[] = [
  {
    accessorKey: 'keyName',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue('keyName') as string;
      return (
        <div className="flex items-center">
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'token',
    header: 'Token',
    cell: ({ row }) => {
      const token = row.getValue('token') as string;
      const redactedToken = `${token.slice(0, 5)}•••••${token.slice(-6)}`;
      return (
        <div className="flex items-center">
          <span className="font-mono">{redactedToken}</span>
          <CopyButton text={token} />
        </div>
      );
    },
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    cell: ({ row }) => {
      const createdBy = row.getValue('createdBy') as string;
      return (
        <div className="flex items-center">
          <span>{createdBy}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.getValue('createdAt') as Date;
      const b = rowB.getValue('createdAt') as Date;
      return a.getTime() - b.getTime();
    },
  },
  {
    accessorKey: 'expireIn',
    header: 'Expires In',
    cell: ({ row }) => {
      const expireIn = row.getValue('expireIn') as number;
      return <div className="text-left">{expireIn} days</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
