"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ListPage from "@/components/ListPage/ListPage";
import { getDevices } from "@/lib/api/devices";
import { MONITOR_COLUMNS } from "@/lib/consts/monitors";
import type { DeviceFilter } from "@/lib/api/devices";

export default function MonitorsPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const filters: DeviceFilter[] = [];
  searchParams.forEach((value, key) => {
    if (key !== "page" && value) {
      filters.push({ key, value });
    }
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["devices", "monitors", currentPage, filters],
    queryFn: () => getDevices("monitor", filters, currentPage),
  });

  const totalPages = Math.ceil((data?.count ?? 0) / 20);

  return (
    <ListPage
      entity="monitor"
      columns={MONITOR_COLUMNS}
      tableData={data?.data}
      isLoading={isLoading}
      error={error}
      pages={{ current: currentPage, total: totalPages }}
    />
  );
}
