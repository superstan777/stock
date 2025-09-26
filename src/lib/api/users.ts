import { createClient } from "@/lib/supabase/client";
import type { UserRow, UserInsert, UserUpdate } from "../types/users";
import type { UserFilterKeyType } from "../constants";

const supabase = createClient();

export const getUsers = async (
  filter?: UserFilterKeyType,
  query?: string,
  page: number = 1,
  perPage: number = 20
): Promise<{ data: UserRow[]; count: number }> => {
  let q = supabase
    .from("users")
    .select("*", { count: "exact" })
    .order("name", { ascending: true });

  if (filter && query) {
    q = q.ilike(filter, `${query}%`);
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};

export const addUser = async (user: UserInsert): Promise<UserRow[]> => {
  const { data, error } = await supabase.from("users").insert([user]);
  if (error) throw error;
  return data ?? [];
};

export const updateUser = async (
  id: string,
  updates: UserUpdate
): Promise<UserRow[]> => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
  return data ?? [];
};

export const deleteUser = async (id: string): Promise<UserRow[]> => {
  const { data, error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
  return data ?? [];
};
