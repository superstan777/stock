import { createClient } from "@/lib/supabase/client";
import type { UserRow, UserInsert, UserUpdate } from "../types/users";
import type { UserFilterKeyType } from "../consts/users";

const supabase = createClient();

export type UserFilter = {
  key: UserFilterKeyType;
  value: string;
};

export const getUsers = async (
  filters: UserFilter[] = [],
  page: number = 1,
  perPage: number = 20
): Promise<{ data: UserRow[]; count: number }> => {
  let q = supabase
    .from("users")
    .select("*", { count: "exact" })
    .order("name", { ascending: true });

  // 🔹 Obsługa wielu filtrów (np. name, email)
  for (const { key, value } of filters) {
    if (!value) continue;

    const values = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (values.length === 0) continue;

    // 🔸 Obsługa wielu wartości (OR) i pojedynczych (ILIKE)
    if (values.length > 1) {
      const orFilters = values.map((v) => `${key}.ilike.${v}%`).join(",");
      q = q.or(orFilters);
    } else {
      q = q.ilike(key, `${values[0]}%`);
    }
  }

  // 🔹 Paginacja
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;

  return {
    data: (data as UserRow[]) ?? [],
    count: count ?? 0,
  };
};

// 🔹 CRUD operacje

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

export const getUser = async (id: string): Promise<UserRow | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data ?? null;
};
