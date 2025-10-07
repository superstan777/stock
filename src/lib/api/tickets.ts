// src/lib/api/tickets.ts
import { createClient } from "@/lib/supabase/client";
import type {
  TicketRow,
  TicketInsert,
  TicketUpdate,
  TicketForTable,
  TicketWithUsers,
} from "../types/tickets";
import type { TicketFilterKeyType } from "../consts/tickets";

const supabase = createClient();

export const getTickets = async (
  filter?: TicketFilterKeyType | "caller.email" | "assigned_to.email",
  query?: string,
  page: number = 1,
  perPage: number = 20
): Promise<{ data: TicketForTable[]; count: number }> => {
  // wybieramy pola oraz aliasy do users; używamy dedykowanych relacji (kluczy FK)
  const selectCaller =
    filter === "caller.email"
      ? "caller:users!tickets_caller_id_fkey!inner(id,email)"
      : "caller:users!tickets_caller_id_fkey(id,email)";

  const selectAssigned =
    filter === "assigned_to.email"
      ? "assigned_to:users!tickets_assigned_to_fkey!inner(id,email)"
      : "assigned_to:users!tickets_assigned_to_fkey(id,email)";

  const selectFields = `
    id,
    number,
    title,
    description,
    status,
    created_at,
    ${selectCaller},
    ${selectAssigned}
  `;

  let q = supabase
    .from("tickets")
    .select(selectFields, { count: "exact" })
    .order("title", { ascending: true });

  if (filter && query) {
    // specjalne traktowanie pola number (bigint)
    if (filter === "number") {
      // jeśli query to tylko cyfry -> equality (dokładne dopasowanie)
      if (/^\d+$/.test(query)) {
        q = q.eq("number", Number(query));
      } else {
        // jeżeli chcesz wspierać wyszukiwanie prefiksowe po numerze (np. "12" -> 123, 124),
        // rzutujemy kolumnę na tekst i używamy ilike
        // (PostgREST / supabase akceptuje 'number::text' jako nazwę pola)
        q = q.ilike("number::text", `${query}%`);
      }
    } else if (filter === "caller.email") {
      q = q.ilike("caller.email", `${query}%`);
    } else if (filter === "assigned_to.email") {
      q = q.ilike("assigned_to.email", `${query}%`);
    } else {
      q = q.ilike(filter, `${query}%`);
    }
  }

  // paginacja
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;
  if (!data) return { data: [], count: 0 };

  const typedData = data as unknown as TicketWithUsers[];

  // mapujemy aliasy caller/assigned_to do struktury TicketForTable
  const mappedData: TicketForTable[] = typedData.map(
    ({ caller, assigned_to, ...ticket }) => ({
      ...ticket,
      caller: caller ? { id: caller.id, email: caller.email } : null,
      assigned_to: assigned_to
        ? { id: assigned_to.id, email: assigned_to.email }
        : null,
    })
  );

  return { data: mappedData, count: count ?? 0 };
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
