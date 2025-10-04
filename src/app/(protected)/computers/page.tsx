"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ListPage from "@/components/ListPage/ListPage";
import { getDevices } from "@/lib/api/devices";
import { COMPUTER_COLUMNS } from "@/lib/constants";
import type { ComputerFilterKeyType } from "@/lib/constants";

export default function ComputersPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const filter = searchParams.get("filter") as
    | ComputerFilterKeyType
    | undefined;
  const query = searchParams.get("query") || undefined;

  const queryKey = "computers";

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, currentPage, filter, query],
    queryFn: () => getDevices("computer", filter, query, currentPage),
  });

  const totalPages = Math.ceil((data?.count ?? 0) / 20);

  const pages = { current: currentPage, total: totalPages };

  return (
    <ListPage
      entity="computer"
      columns={COMPUTER_COLUMNS}
      tableData={data?.data}
      isLoading={isLoading}
      error={error}
      clickableField="serial_number"
      pages={pages}
    />
  );
}
