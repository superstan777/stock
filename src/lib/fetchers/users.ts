import type { User } from "../types/users";

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }

  const data: User[] = await res.json();
  return data;
};
