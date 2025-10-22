"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ListPage from "@/components/ListPage/ListPage";
import { getDevices, type DeviceFilter } from "@/lib/api/devices";
import { COMPUTER_COLUMNS } from "@/lib/consts/computers";

export default function ComputersPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const filters: DeviceFilter[] = [];
  searchParams.forEach((value, key) => {
    if (key !== "page" && value) {
      filters.push({ key, value });
    }
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["devices", "computers", currentPage, filters],
    queryFn: () => getDevices("computer", filters, currentPage),
  });

  const totalPages = Math.ceil((data?.count ?? 0) / 20);

  return (
    <ListPage
      entity="computer"
      columns={COMPUTER_COLUMNS}
      tableData={data?.data}
      isLoading={isLoading}
      error={error}
      pages={{ current: currentPage, total: totalPages }}
    />
  );
}
