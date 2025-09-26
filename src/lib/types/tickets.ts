import { Database } from "../types/supabase";

export type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];
export type TicketInsert = Database["public"]["Tables"]["tickets"]["Insert"];
export type TicketUpdate = Database["public"]["Tables"]["tickets"]["Update"];

export type TicketWithUser = Omit<TicketRow, "caller_id"> & {
  caller: { email: string | null } | null;
};

export type TicketForTable = Omit<TicketWithUser, "caller"> & {
  caller_email: string | null;
};
