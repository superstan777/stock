import { Database } from "../types/supabase";

export type WorknoteRow = Database["public"]["Tables"]["worknotes"]["Row"];
export type WorknoteInsert =
  Database["public"]["Tables"]["worknotes"]["Insert"];

export type WorknoteWithAuthor = Omit<WorknoteRow, "author_id"> & {
  author: {
    id: string;
    email: string;
  } | null;
};
