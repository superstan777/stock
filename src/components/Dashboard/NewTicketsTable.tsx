"use client";

import { DataTable } from "@/components/ListPage/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getNewTickets } from "@/lib/api/tickets";
import { TICKET_COLUMNS } from "@/lib/consts/tickets";

export const NewTicketsTable = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["newTickets"],
    queryFn: () => getNewTickets(),
  });

  return (
    <div>
      <DataTable
        data={data}
        isLoading={isLoading}
        error={error}
        columns={TICKET_COLUMNS}
        entity="ticket"
      />
    </div>
  );
};
