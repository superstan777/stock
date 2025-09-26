import { createClient } from "@/lib/supabase/client";
import type { TicketRow, TicketInsert, TicketUpdate } from "../types/tickets";
import type { TicketFilterKeyType } from "../constants";

const supabase = createClient();

export const getTickets = async (
  filter?: TicketFilterKeyType,
  query?: string,
  page: number = 1,
  perPage: number = 20
): Promise<{ data: TicketRow[]; count: number }> => {
  let q = supabase
    .from("tickets")
    .select("*", { count: "exact" })
    .order("title", { ascending: true });

  if (filter && query) {
    q = q.ilike(filter, `${query}%`);
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};

export const addTicket = async (ticket: TicketInsert): Promise<TicketRow[]> => {
  const { data, error } = await supabase.from("tickets").insert([ticket]);
  if (error) throw error;
  return data ?? [];
};

export const updateTicket = async (
  id: string,
  updates: TicketUpdate
): Promise<TicketRow[]> => {
  const { data, error } = await supabase
    .from("tickets")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
  return data ?? [];
};

export const deleteTicket = async (id: string): Promise<TicketRow[]> => {
  const { data, error } = await supabase.from("tickets").delete().eq("id", id);
  if (error) throw error;
  return data ?? [];
};
