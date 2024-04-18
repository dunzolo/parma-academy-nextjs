"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "./scroll-area";
import Image from "next/image";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKeyName?: string;
  searchKeyCategory?: string;
  isRanking?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKeyName = undefined,
  searchKeyCategory = undefined,
  isRanking = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const heightTable = {
    default: "h-[calc(80vh-204px)]",
    Estrutural: "text-green-500",
    Investimento: "text-blue-500",
    Viagens: "text-yellow-500",
    // ...
  };

  /* this can be used to get the selectedrows 
  console.log("value", table.getFilteredSelectedRowModel()); */

  return (
    <>
      <div className="flex">
        {searchKeyName ? (
          <div className="grid w-full max-w-sm items-center gap-1.5 mr-3">
            <Label htmlFor="name">Nome squadra</Label>
            <Input
              placeholder={`Cerca ...`}
              value={
                (table.getColumn(searchKeyName)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchKeyName)
                  ?.setFilterValue(event.target.value)
              }
              className="w-full md:max-w-sm"
            />
          </div>
        ) : null}
        {searchKeyCategory ? (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Categoria</Label>
            <Input
              placeholder={`Cerca ...`}
              value={
                (table
                  .getColumn(searchKeyCategory)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchKeyCategory)
                  ?.setFilterValue(event.target.value)
              }
              className="w-full md:max-w-sm"
            />
          </div>
        ) : null}
      </div>

      <ScrollArea
        className={`rounded-md border ${
          isRanking ? "" : "h-[calc(80vh-225px)]"
        }`}
      >
        <Table className="relative">
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
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.header == "LOGO" ? (
                        cell.getValue() ? (
                          <Image
                            src={cell.getValue() as string}
                            alt={"logo"}
                            width={50}
                            height={50}
                          />
                        ) : (
                          ""
                        )
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {!isRanking ? (
        <div className="flex items-center justify-end space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      ) : null}
    </>
  );
}
