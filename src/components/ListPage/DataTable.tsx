"use client";

import { useRouter } from "next/navigation";
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
import { formatDate } from "@/lib/utils";
import { EndRelationButton } from "../EndRelationButton";
import type { RelationWithDetails } from "@/lib/types/relations";

function getNestedValue<T extends object>(obj: T, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

interface DataTableProps<T extends EntityType> {
  data: EntityDataMap[T][] | undefined;
  isLoading: boolean;
  error: unknown;
  columns: ColumnOption<T>[];
  entity: T;
}

export function DataTable<T extends EntityType>({
  data,
  isLoading,
  error,
  columns,
  entity,
}: DataTableProps<T>) {
  const router = useRouter();

  const entityRoutes: Record<EntityType, string> = {
    user: "users",
    computer: "computers",
    monitor: "monitors",
    ticket: "tickets",
    relation: "relations",
  };

  const handleCellClick = (row: EntityDataMap[T], col: ColumnOption<T>) => {
    const route = col.getRoute
      ? col.getRoute(row)
      : col.route ?? entityRoutes[entity];
    const id = col.routeIdPath
      ? getNestedValue(row, col.routeIdPath)
      : (row as { id: string }).id;

    if (typeof id === "string" && route) {
      router.push(`/${route}/${id}`);
    }
  };

  const renderCellContent = (col: ColumnOption<T>, row: EntityDataMap[T]) => {
    let value = getNestedValue(row, col.value);

    if (col.value === "actions" && entity === "relation") {
      const relation = row as RelationWithDetails;

      if (relation.end_date) {
        return <span className="text-gray-400 ml-0">Ended</span>;
      }

      return (
        <EndRelationButton
          relationId={relation.id}
          userId={relation.user?.id}
          deviceId={relation.device?.id}
        />
      );
    }

    // ✅ Formatowanie wartości typu "date"
    if (col.format === "date" && value) {
      try {
        value = formatDate(new Date(String(value)));
      } catch {}
    }

    // ✅ Obsługa pól z linkami (route lub getRoute)
    if (col.route || col.getRoute) {
      return (
        <Button
          variant="link"
          size="sm"
          onClick={() => handleCellClick(row, col)}
          className="p-0 justify-start"
        >
          {value !== null && value !== undefined && value !== "" ? (
            String(value)
          ) : (
            <span className="text-gray-400">None</span>
          )}
        </Button>
      );
    }

    // ✅ Obsługa pustych wartości
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400">None</span>;
    }

    return String(value);
  };

  // ✅ Loading skeleton
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

  // ✅ Error handling
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

  // ✅ Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-500">
        No {entity}s found
      </div>
    );
  }

  // ✅ Normal render
  return (
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
            <TableRow key={(row as { id: string }).id}>
              {columns.map((col) => (
                <TableCell key={col.value}>
                  {renderCellContent(col, row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
