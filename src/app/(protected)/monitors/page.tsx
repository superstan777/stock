"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ListPage from "@/components/ListPage/ListPage";
import { getDevices } from "@/lib/api/devices";
import { MONITOR_COLUMNS } from "@/lib/consts/monitors";
import { ComputerFilterKeyType } from "@/lib/consts/computers";

export default function ComputersPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const filter = searchParams.get("filter") as
    | ComputerFilterKeyType
    | undefined;

  const query = searchParams.get("query") || undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ["devices", currentPage, filter, query],
    queryFn: () => getDevices("monitor", filter, query, currentPage),
  });

  const totalPages = Math.ceil((data?.count ?? 0) / 20);

  const pages = { current: currentPage, total: totalPages };

  return (
    <ListPage
      entity="monitor"
      columns={MONITOR_COLUMNS}
      tableData={data?.data}
      isLoading={isLoading}
      error={error}
      pages={pages}
    />
  );
}
