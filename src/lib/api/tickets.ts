import { createClient } from "@/lib/supabase/client";
import type {
  TicketRow,
  TicketInsert,
  TicketUpdate,
  TicketForTable,
  TicketWithUser,
} from "../types/tickets";
import type { TicketFilterKeyType } from "../constants";

const supabase = createClient();

export const getTickets = async (
  filter?: TicketFilterKeyType | "user.email",
  query?: string,
  page: number = 1,
  perPage: number = 20
): Promise<{ data: TicketForTable[]; count: number }> => {
  let q = supabase
    .from("tickets")
    .select(
      `
      *,
      caller:users!caller_id(email)
    `,
      { count: "exact" }
    )
    .order("title", { ascending: true });

  if (filter && query) {
    if (filter === "user.email") {
      q = q.ilike("caller.email", `${query}%`);
    } else {
      q = q.ilike(filter, `${query}%`);
    }
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;

  // Mapowanie caller.email na user_email
  const mappedData: TicketForTable[] = (data as TicketWithUser[]).map(
    ({ caller, ...ticket }) => ({
      ...ticket,
      caller_email: caller?.email ?? null,
    })
  );

  return {
    data: mappedData,
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

export const getUserTickets = async (
  userId: string,
  page: number = 1,
  perPage: number = 20
): Promise<{ data: TicketRow[]; count: number }> => {
  let q = supabase
    .from("tickets")
    .select("*", { count: "exact" })
    .eq("caller_id", userId)
    .order("created_at", { ascending: false });

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;

  return {
    data: (data as TicketRow[]) ?? [],
    count: count ?? 0,
  };
};
