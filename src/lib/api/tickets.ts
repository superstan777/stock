import { createClient } from "@/lib/supabase/client";
import type {
  TicketRow,
  TicketInsert,
  TicketUpdate,
  TicketWithUsers,
} from "../types/tickets";
import type { TicketFilterKeyType } from "../consts/tickets";

const supabase = createClient();

export type TicketFilter = {
  key: TicketFilterKeyType | "caller.email" | "assigned_to.email";
  value: string;
};

export const getTickets = async (
  filters: TicketFilter[] = [],
  page: number = 1,
  perPage: number = 20
): Promise<{ data: TicketWithUsers[]; count: number }> => {
  const hasAssignedEmailFilter = filters.some(
    (f) => f.key === "assigned_to.email"
  );

  const selectCaller = filters.some((f) => f.key === "caller.email")
    ? "caller:users!tickets_caller_id_fkey!inner(id,email)"
    : "caller:users!tickets_caller_id_fkey(id,email)";

  const selectAssigned = hasAssignedEmailFilter
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

  // 🔹 Obsługa wielu filtrów
  for (const { key, value } of filters) {
    if (!value) continue;

    const values = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (key === "number") {
      // Obsługa wielu numerów i/lub częściowych fraz
      const numericValues = values.filter((v) => /^\d+$/.test(v)).map(Number);
      const nonNumericValues = values.filter((v) => !/^\d+$/.test(v));

      if (numericValues.length > 0 && nonNumericValues.length === 0) {
        // tylko liczby -> użyj `in` albo `eq`
        if (numericValues.length > 1) q = q.in("number", numericValues);
        else q = q.eq("number", numericValues[0]);
      } else {
        // są nienumeryczne wpisy (lub mieszanka) -> użyj `or` z number::text.ilike
        const orExpr = values.map((v) => `number::text.ilike.${v}%`).join(",");
        q = q.or(orExpr);
      }
    } else if (key === "caller.email") {
      for (const val of values) q = q.ilike("caller.email", `${val}%`);
    } else if (key === "assigned_to.email") {
      // 🔸 Szukanie po emailu przypisanego operatora (INNER JOIN)
      for (const val of values) q = q.ilike("assigned_to.email", `${val}%`);
    } else if (key === "assigned_to") {
      // 🔸 Szukanie ticketów bez przypisanego operatora
      if (values[0] === "null") {
        q = q.is("assigned_to", null);
      } else {
        q = q.eq("assigned_to", values[0]);
      }
    } else if (
      key === "estimated_resolution_date" ||
      key === "resolution_date"
    ) {
      if (values[0] === "null") {
        q = q.is(key, null);
      } else {
        const localDate = new Date(values[0] + "T00:00:00");
        const startUtc = new Date(localDate.getTime());
        const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000 - 1);
        q = q.gte(key, startUtc.toISOString()).lte(key, endUtc.toISOString());
      }
    } else if (key === "status") {
      if (values.length > 1) q = q.in("status", values);
      else q = q.eq("status", values[0]);
    } else {
      if (values.length > 1) {
        q = q.or(values.map((v) => `${key}.ilike.${v}%`).join(","));
      } else {
        q = q.ilike(key, `${values[0]}%`);
      }
    }
  }

  // 🔸 Paginacja
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  q = q.range(from, to);

  // 🔸 Wykonanie zapytania
  const { data, count, error } = await q;
  if (error) throw error;
  if (!data) return { data: [], count: 0 };

  // 🔸 Mapowanie wyników
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
    .in("status", ["New", "On Hold", "In Progress"]);

  if (error) throw error;

  const countsByDate = data.reduce<Record<string, number>>((acc, ticket) => {
    if (!ticket.estimated_resolution_date) {
      acc["No ETA"] = (acc["No ETA"] || 0) + 1;
      return acc;
    }

    // 🔹 Zamiana UTC → lokalna data
    const utcDate = new Date(ticket.estimated_resolution_date);
    const localYear = utcDate.getFullYear();
    const localMonth = String(utcDate.getMonth() + 1).padStart(2, "0");
    const localDay = String(utcDate.getDate()).padStart(2, "0");
    const localDateString = `${localYear}-${localMonth}-${localDay}`;

    acc[localDateString] = (acc[localDateString] || 0) + 1;
    return acc;
  }, {});

  // 🔹 Sortowanie: "No ETA" na początku, daty rosnąco
  const sorted = Object.entries(countsByDate).sort(([a], [b]) => {
    if (a === "No ETA") return -1;
    if (b === "No ETA") return 1;
    return a.localeCompare(b);
  });

  return sorted.map(([date, count]) => ({ date, count }));
};

export const getTicketsByOperator = async (): Promise<
  {
    operator: { id: string | null; name: string; email: string | null };
    count: number;
  }[]
> => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      assigned_to:users!tickets_assigned_to_fkey(id, name, email),
      status
    `
    )
    .neq("status", "Resolved");

  if (error) throw error;

  const countsByOperator = (data ?? []).reduce<
    Record<
      string,
      {
        operator: { id: string | null; name: string; email: string | null };
        count: number;
      }
    >
  >((acc, ticket) => {
    const operator = ticket.assigned_to;
    const key = operator?.id ?? "unassigned";

    if (!acc[key]) {
      acc[key] = {
        operator: {
          id: operator?.id ?? null,
          name: operator?.name ?? "Unassigned",
          email: operator?.email ?? null,
        },
        count: 0,
      };
    }

    acc[key].count += 1;
    return acc;
  }, {});

  return Object.values(countsByOperator);
};
