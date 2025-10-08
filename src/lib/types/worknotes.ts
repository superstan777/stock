import { Database } from "../types/supabase";

export type WorknoteRow = Database["public"]["Tables"]["worknotes"]["Row"];
export type WorknoteInsert =
  Database["public"]["Tables"]["worknotes"]["Insert"];
