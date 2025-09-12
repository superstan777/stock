// ListPage.tsx
"use client";

import { ListHeader } from "./ListHeader";
import { ColumnOption } from "@/lib/types/table";

interface ListPageProps<T> {
  entityName: string;
  columns: ColumnOption[];
}

export default function ListPage<T>({ entityName, columns }: ListPageProps<T>) {
  return (
    <div className="flex flex-col h-full">
      <ListHeader entityName={entityName} columns={columns} />
    </div>
  );
}
