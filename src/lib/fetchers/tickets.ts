import type { TicketRow, TicketInsert, TicketUpdate } from "../types/tickets";
import type { TicketFilterKeyType } from "../constants";

const API_BASE = "/api/tickets";

export const getTickets = async (options?: {
  filter?: TicketFilterKeyType;
  query?: string;
  page?: number;
  perPage?: number;
}): Promise<{ data: TicketRow[]; count: number }> => {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.perPage) params.set("perPage", String(options.perPage));
  if (options?.filter) params.set("filter", options.filter);
  if (options?.query) params.set("query", options.query);

  const res = await fetch(`${API_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
};

export const addTicket = async (ticket: TicketInsert): Promise<TicketRow[]> => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });
  if (!res.ok) throw new Error("Failed to add ticket");
  return res.json();
};

export const updateTicket = async (
  id: string,
  updates: TicketUpdate
): Promise<TicketRow[]> => {
  const res = await fetch(API_BASE, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error("Failed to update ticket");
  return res.json();
};

export const removeTicket = async (id: string): Promise<TicketRow[]> => {
  const res = await fetch(API_BASE, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete ticket");
  return res.json();
};
