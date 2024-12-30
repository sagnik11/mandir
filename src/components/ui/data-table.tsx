"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getPaginationRowModel,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  getFilteredRowModel,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableFiltering?: boolean;
  filterableColumns?: string[];
  filterPlaceholder?: string;
  enableColumnVisibilitySelection?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  emptyIcon = <FileQuestion className="h-8 w-8 text-muted-foreground" />,
  emptyText = "No results found",
  enableSorting = true,
  enablePagination = true,
  enableRowSelection = false,
  enableFiltering = false,
  filterableColumns = [],
  filterPlaceholder = "Filter...",
  enableColumnVisibilitySelection = false,
}: DataTableProps<TData, TValue>) {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState("1");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, _setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fuzzyFilter: FilterFn<any> = (row, _columnId, value, _addMeta) => {
    // Return true if any of the filterable columns contain the search value
    return filterableColumns.some((columnId) => {
      const cellValue = row.getValue(columnId);
      if (!cellValue) return false;
      return String(cellValue).toLowerCase().includes(value.toLowerCase());
    });
  };

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    onSortingChange: enableSorting ? setSorting : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    enableRowSelection,
    state: {
      pagination: enablePagination
        ? {
            pageSize,
            pageIndex: parseInt(pageIndex) - 1,
          }
        : { pageSize: data.length, pageIndex: 0 },
      sorting: enableSorting ? sorting : undefined,
      columnFilters: enableFiltering ? columnFilters : undefined,
      columnVisibility,
      rowSelection: enableRowSelection ? rowSelection : {},
      globalFilter,
    },
    onPaginationChange: enablePagination
      ? (updater) => {
          const newPagination =
            typeof updater === "function"
              ? updater({
                  pageSize,
                  pageIndex: parseInt(pageIndex) - 1,
                })
              : updater;

          setPageIndex((newPagination.pageIndex + 1).toString());
          setPageSize(newPagination.pageSize);
        }
      : undefined,
  });

  const totalPages = enablePagination ? table.getPageCount() : 0;

  return (
    <>
      <div className="flex items-center py-4 gap-4">
        {enableFiltering && filterableColumns.length > 0 && (
          <Input
            placeholder={filterPlaceholder}
            value={globalFilter ?? ""}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
            }}
            className="max-w-sm"
          />
        )}
        {enableColumnVisibilitySelection && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    enableRowSelection && row.getIsSelected()
                      ? "selected"
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[400px] text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {emptyIcon}
                    <p className="text-muted-foreground">{emptyText}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm hidden sm:block">Rows per page:</p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue>{pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-sm">
              Page {parseInt(pageIndex)} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setPageIndex(Math.max(1, parseInt(pageIndex) - 1).toString())
                }
                disabled={parseInt(pageIndex) <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select value={pageIndex} onValueChange={setPageIndex}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue>{pageIndex}</SelectValue>
                </SelectTrigger>
                <SelectContent side="top">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <SelectItem key={page} value={page.toString()}>
                        {page}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setPageIndex(
                    Math.min(totalPages, parseInt(pageIndex) + 1).toString(),
                  )
                }
                disabled={parseInt(pageIndex) >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

{
  /* <DataTable
  columns={columns}
  data={data}
  enableSorting={true}
  enablePagination={true}
  enableRowSelection={false} // or true if you want row selection
  enableFiltering={true}
  filterableColumns={['email', 'status']}
  filterPlaceholder="Search members..."
  enableColumnVisibilitySelection={true}
/> */
}
{
  /* <DataTable 
  columns={columns} 
  data={data}
  emptyIcon={<Users className="h-8 w-8 text-muted-foreground" />}
  emptyText="No members found in your organization" 
/> */
}
