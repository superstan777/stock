"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserTickets } from "@/lib/api/tickets";
import type { TicketForTable, TicketRow } from "@/lib/types/tickets";
import { DataTable } from "../ListPage/DataTable";
import { USER_TICKETS_COLUMNS } from "@/lib/constants";

interface UserTicketsListProps {
  userId: string;
}

export const UserTicketsList = ({ userId }: UserTicketsListProps) => {
  const { data, isLoading, isError, error } = useQuery<{
    data: TicketRow[];
    count: number;
  }>({
    queryKey: ["userTickets", userId],
    queryFn: () => getUserTickets(userId),
  });

  if (isLoading) {
    return <div className="mt-8 text-center">Loading tickets...</div>;
  }

  if (isError) {
    return (
      <div className="mt-8 text-red-500 text-center">
        Error loading tickets.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <DataTable
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error}
        columns={USER_TICKETS_COLUMNS}
        entity="ticket"
      />
    </div>
  );
};
