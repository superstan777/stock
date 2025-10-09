import { createClient } from "@/lib/supabase/client";
import type {
  WorknoteRow,
  WorknoteInsert,
  WorknoteWithAuthor,
} from "../types/worknotes";

const supabase = createClient();

// --- GET WORKNOTES ---
export const getWorknotes = async (
  ticketId: string
): Promise<WorknoteWithAuthor[]> => {
  const { data, error } = await supabase
    .from("worknotes")
    .select(
      `
      id,
      note,
      created_at,
      author:users(id, email)
    `
    )
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  const typedData = data as unknown as WorknoteWithAuthor[];

  const mappedData: WorknoteWithAuthor[] = typedData.map(
    ({ author, ...note }) => ({
      ...note,
      author: author ? { id: author.id, email: author.email } : null,
    })
  );

  return mappedData;
};

export const addWorknote = async (
  worknote: WorknoteInsert
): Promise<WorknoteRow[]> => {
  const { data, error } = await supabase.from("worknotes").insert([worknote]);
  if (error) throw error;
  return data ?? [];
};
