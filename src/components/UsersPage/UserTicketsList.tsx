"use client";

import { DataTable } from "../ListPage/DataTable";
import { USER_TICKETS_COLUMNS } from "@/lib/consts/tickets";
import type { TicketRow } from "@/lib/types/tickets";

interface UserTicketsListProps {
  userId: string;
  tickets: TicketRow[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export const UserTicketsList = ({
  tickets,
  isLoading,
  isError,
  error,
}: UserTicketsListProps) => {
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
        data={tickets}
        columns={USER_TICKETS_COLUMNS}
        isLoading={isLoading}
        error={error}
        entity="ticket"
      />
    </div>
  );
};
