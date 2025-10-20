import { createClient } from "@/lib/supabase/client";
import type {
  TicketRow,
  TicketInsert,
  TicketUpdate,
  TicketWithUsers,
} from "../types/tickets";
import type { TicketFilterKeyType } from "../consts/tickets";

const supabase = createClient();

export const getTickets = async (
  filter?: TicketFilterKeyType | "caller.email" | "assigned_to.email",
  query?: string,
  page: number = 1,
  perPage: number = 20
): Promise<{ data: TicketWithUsers[]; count: number }> => {
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
    estimated_resolution_date,
    resolution_date,
    ${selectCaller},
    ${selectAssigned}
  `;

  let q = supabase
    .from("tickets")
    .select(selectFields, { count: "exact" })
    .order("title", { ascending: true });

  if (filter && query) {
    if (filter === "number") {
      if (/^\d+$/.test(query)) {
        q = q.eq("number", Number(query));
      } else {
        q = q.ilike("number::text", `${query}%`);
      }
    } else if (filter === "caller.email") {
      q = q.ilike("caller.email", `${query}%`);
    } else if (filter === "assigned_to.email") {
      q = q.ilike("assigned_to.email", `${query}%`);
    } else if (
      filter === "estimated_resolution_date" ||
      filter === "resolution_date"
    ) {
      const localDate = new Date(query + "T00:00:00");

      const start = new Date(localDate.getTime()).toISOString();
      const end = new Date(
        localDate.getTime() + 24 * 60 * 60 * 1000 - 1
      ).toISOString();

      q = q.gte(filter, start).lte(filter, end);
    } else {
      q = q.ilike(filter, `${query}%`);
    }
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;
  if (!data) return { data: [], count: 0 };

  const typedData = data as unknown as TicketWithUsers[];

  const mappedData: TicketWithUsers[] = typedData.map(
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

export const getTicket = async (
  id: string
): Promise<TicketWithUsers | null> => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      id,
      number,
      title,
      description,
      status,
      created_at,
      estimated_resolution_date,
      resolution_date,
      caller:users!tickets_caller_id_fkey(id,email),
      assigned_to:users!tickets_assigned_to_fkey(id,email)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const { caller, assigned_to, ...ticket } = data as unknown as TicketWithUsers;

  return {
    ...ticket,
    caller: caller ? { id: caller.id, email: caller.email } : null,
    assigned_to: assigned_to
      ? { id: assigned_to.id, email: assigned_to.email }
      : null,
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

export const getNewTickets = async (): Promise<TicketWithUsers[]> => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      id,
      number,
      title,
      description,
      status,
      created_at,
      estimated_resolution_date,
      resolution_date,
      caller:users!tickets_caller_id_fkey(id,email),
      assigned_to:users!tickets_assigned_to_fkey(id,email)
    `
    )
    .eq("status", "New")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  const typedData = data as unknown as TicketWithUsers[];

  return typedData.map(({ caller, assigned_to, ...ticket }) => ({
    ...ticket,
    caller: caller ? { id: caller.id, email: caller.email } : null,
    assigned_to: assigned_to
      ? { id: assigned_to.id, email: assigned_to.email }
      : null,
  }));
};

export const getResolvedTicketsStats = async (): Promise<
  { date: string; count: number }[]
> => {
  const { data, error } = await supabase
    .from("tickets")
    .select("resolution_date")
    .gte(
      "resolution_date",
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    )
    .not("resolution_date", "is", null)
    .eq("status", "Resolved");

  if (error) throw error;

  const countsByDate = data.reduce<Record<string, number>>((acc, ticket) => {
    const utcDate = new Date(ticket.resolution_date!);

    const localYear = utcDate.getFullYear();
    const localMonth = String(utcDate.getMonth() + 1).padStart(2, "0");
    const localDay = String(utcDate.getDate()).padStart(2, "0");

    const localDateString = `${localYear}-${localMonth}-${localDay}`;

    acc[localDateString] = (acc[localDateString] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(countsByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
};

export const getOpenTicketsStats = async (): Promise<
  { date: string; count: number }[]
> => {
  const { data, error } = await supabase
    .from("tickets")
    .select("estimated_resolution_date, status")
    .neq("status", "Resolved");

  if (error) throw error;

  const countsByDate: Record<string, number> = {};

  data.forEach((ticket) => {
    const day = ticket.estimated_resolution_date
      ? ticket.estimated_resolution_date.slice(0, 10)
      : "No ETA";
    countsByDate[day] = (countsByDate[day] || 0) + 1;
  });

  return Object.entries(countsByDate)
    .sort(([a], [b]) => {
      if (a === "No ETA") return -1;
      if (b === "No ETA") return 1;
      return a.localeCompare(b);
    })
    .map(([date, count]) => ({ date, count }));
};

export const getTicketsByOperator = async (): Promise<
  { operator: { id: string | null; name: string }; count: number }[]
> => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      assigned_to:users!tickets_assigned_to_fkey(id, name),
      status
    `
    )
    .neq("status", "Resolved");

  if (error) throw error;

  const countsByOperator = data.reduce<
    Record<
      string,
      { operator: { id: string | null; name: string }; count: number }
    >
  >((acc, ticket) => {
    const operator = ticket.assigned_to;
    const key = operator?.id || "unassigned";

    if (!acc[key]) {
      acc[key] = {
        operator: {
          id: operator?.id || null,
          name: operator?.name || "Unassigned",
        },
        count: 0,
      };
    }

    acc[key].count += 1;
    return acc;
  }, {});

  return Object.values(countsByOperator);
};
