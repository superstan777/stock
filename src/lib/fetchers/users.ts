import type { UserRow, UserInsert, UserUpdate } from "../types/users";

const API_BASE = "/api/users";

export const getUsers = async (options?: {
  filter?: "name" | "email";
  query?: string;
  page?: number;
  perPage?: number;
}): Promise<{ data: UserRow[]; count: number }> => {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.perPage) params.set("perPage", String(options.perPage));
  if (options?.filter) params.set("filter", options.filter);
  if (options?.query) params.set("query", options.query);

  const res = await fetch(`${API_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const addUser = async (user: UserInsert): Promise<UserRow[]> => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to add user");
  return res.json();
};

export const updateUser = async (
  id: string,
  updates: UserUpdate
): Promise<UserRow[]> => {
  const res = await fetch(API_BASE, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
};

export const removeUser = async (id: string): Promise<UserRow[]> => {
  const res = await fetch(API_BASE, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};
