"use client";

import { DataTable } from "./DataTable";
import { ListHeader } from "./ListHeader";
import { ColumnOption } from "@/lib/types/table";
import type { EntityType, EntityData } from "@/lib/types/table";

interface ListPageProps<T extends EntityType> {
  entity: T;
  columns: ColumnOption[];
  queryResult: { data: EntityData<T>[]; count: number } | undefined;
  clickableField: string;
  isLoading: boolean;
  error: unknown;
}

export default function ListPage<T extends EntityType>({
  entity,
  columns,
  queryResult,
  clickableField,
  isLoading,
  error,
}: ListPageProps<T>) {
  return (
    <div className="flex flex-col h-full">
      <ListHeader entityName={entity} columns={columns} />

      <DataTable
        data={queryResult?.data}
        isLoading={isLoading}
        error={error}
        columns={columns}
        clickableField={clickableField}
        entity={entity}
      />

      {/* <PaginationControls currentPage={currentPage} totalCount={queryResult?.count ?? 0} pageSize={20} /> */}
    </div>
  );
}
