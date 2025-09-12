import { Database } from "../types/supabase";

// ????

// export type UserInsert = Omit<UserRow, "id" | "created_at">;
// export type UserUpdate = Partial<UserInsert>;

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
