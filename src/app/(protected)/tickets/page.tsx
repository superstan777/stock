"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ListPage from "@/components/ListPage/ListPage";

import { getTickets } from "@/lib/fetchers/tickets";
import { TICKET_COLUMNS } from "@/lib/constants";
import type { TicketFilterKeyType } from "@/lib/constants";

export default function ComputersPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const filter = searchParams.get("filter") as TicketFilterKeyType | undefined;

  const query = searchParams.get("query") || undefined;

  const queryKey = "monitors";

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, currentPage, filter, query],
    queryFn: () =>
      getTickets({
        filter,
        query,
        page: currentPage,
        perPage: 20,
      }),
  });
  console.log(data);

  const totalPages = Math.ceil((data?.count ?? 0) / 20);

  const pages = { current: currentPage, total: totalPages };

  return (
    <ListPage
      entity="ticket"
      columns={TICKET_COLUMNS}
      tableData={data?.data}
      isLoading={isLoading}
      error={error}
      clickableField="number"
      pages={pages}
    />
  );
}
