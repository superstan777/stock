import { createClient } from "@/lib/supabase/client";
import { WorknoteRow, WorknoteInsert } from "../types/worknotes";

const supabase = createClient();

export const getWorknotes = async (
  ticketId: string
): Promise<WorknoteRow[]> => {
  const { data, error } = await supabase
    .from("worknotes")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

export const addWorknote = async (
  worknote: WorknoteInsert
): Promise<WorknoteRow[]> => {
  const { data, error } = await supabase.from("worknotes").insert([worknote]);
  if (error) throw error;
  return data ?? [];
};
