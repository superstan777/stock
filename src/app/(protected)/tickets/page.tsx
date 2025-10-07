"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ListPage from "@/components/ListPage/ListPage";
import { getTickets } from "@/lib/api/tickets";

import { TICKET_COLUMNS } from "@/lib/consts/tickets";
import { TicketFilterKeyType } from "@/lib/consts/tickets";

export default function ComputersPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const filter = searchParams.get("filter") as TicketFilterKeyType | undefined;

  const query = searchParams.get("query") || undefined;

  const queryKey = "tickets";

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, currentPage, filter, query],
    queryFn: () => getTickets(filter, query, currentPage),
  });

  const totalPages = Math.ceil((data?.count ?? 0) / 20);

  const pages = { current: currentPage, total: totalPages };

  return (
    <ListPage
      entity="ticket"
      columns={TICKET_COLUMNS}
      tableData={data?.data}
      isLoading={isLoading}
      error={error}
      pages={pages}
    />
  );
}
