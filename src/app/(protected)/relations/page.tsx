"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ListPage from "@/components/ListPage/ListPage";
import { getRelations } from "@/lib/api/relations";
import { RELATION_COLUMNS } from "@/lib/consts/relations";
import type { RelationFilterKeyType } from "@/lib/consts/relations";

export default function RelationsPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const filter = searchParams.get("filter") as
    | RelationFilterKeyType
    | undefined;
  const query = searchParams.get("query") || undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ["relations", currentPage, filter, query],
    queryFn: () => getRelations(filter, query, currentPage),
  });

  const totalPages = Math.ceil((data?.count ?? 0) / 20);
  const pages = { current: currentPage, total: totalPages };

  console.log(data);

  return (
    <ListPage
      entity="relation"
      columns={RELATION_COLUMNS}
      tableData={data?.data}
      isLoading={isLoading}
      error={error}
      pages={pages}
    />
  );
}
