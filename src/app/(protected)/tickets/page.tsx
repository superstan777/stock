"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ListPage from "@/components/ListPage/ListPage";
import { getTickets } from "@/lib/api/tickets";
import { TICKET_COLUMNS } from "@/lib/consts/tickets";
import type { TicketFilter } from "@/lib/api/tickets";

export default function TicketsPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const filters: TicketFilter[] = [];

  searchParams.forEach((value, key) => {
    if (!["page"].includes(key) && value) {
      filters.push({ key: key as TicketFilter["key"], value });
    }
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["tickets", currentPage, filters],
    queryFn: () => getTickets(filters, currentPage),
  });

  const totalPages = Math.ceil((data?.count ?? 0) / 20);

  return (
    <ListPage
      entity="ticket"
      columns={TICKET_COLUMNS}
      tableData={data?.data}
      isLoading={isLoading}
      error={error}
      pages={{ current: currentPage, total: totalPages }}
    />
  );
}
