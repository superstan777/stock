import { Database } from "../types/supabase";

export type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];
export type TicketInsert = Database["public"]["Tables"]["tickets"]["Insert"];
export type TicketUpdate = Database["public"]["Tables"]["tickets"]["Update"];

export type TicketWithUsers = Omit<TicketRow, "caller_id" | "assigned_to"> & {
  caller: { id: string; email: string | null } | null;
  assigned_to: { id: string; email: string | null } | null;
};
