"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  ColumnOption,
  EntityType,
  EntityData,
  EntityDataMap,
} from "@/lib/types/table";
import { FormDialog } from "./FormDialog";

interface DataTableProps<T extends EntityType> {
  data: EntityDataMap[T][] | undefined; // <- tutaj też korzystamy z mapy
  isLoading: boolean;
  error: unknown;
  columns: ColumnOption[];
  entity: T;
  clickableField?: string;
}

export function DataTable<T extends EntityType>({
  data,
  isLoading,
  error,
  columns,
  entity,
  clickableField,
}: DataTableProps<T>) {
  const [selectedRow, setSelectedRow] = useState<EntityData<T> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCellClick = (row: EntityData<T>) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const renderCellContent = (colValue: string, row: EntityData<T>) => {
    const value = row[colValue as keyof typeof row];

    if (colValue === clickableField) {
      return (
        <Button variant="link" onClick={() => handleCellClick(row)}>
          {value as React.ReactNode}
        </Button>
      );
    }

    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400">None</span>;
    }

    return value as React.ReactNode;
  };

  if (isLoading) {
    const skeletonRows = Array.from({ length: 20 });
    return (
      <div className="flex flex-col h-full w-full space-y-4">
        {skeletonRows.map((_, i) => (
          <div key={i} className="flex space-x-4">
            {columns.map((col) => (
              <Skeleton key={col.value} className="h-10 flex-1 min-w-[80px]" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "An unexpected error occurred";

    return (
      <div className="flex items-center justify-center h-full w-full p-8">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load data</AlertTitle>
            <AlertDescription className="mt-2">{message}</AlertDescription>
          </Alert>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-500">
        No {entity}s found
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-auto mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.value}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.value}>
                    {renderCellContent(col.value, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedRow && (
        <FormDialog
          entity={entity}
          entityData={selectedRow}
          mode="edit"
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
}
