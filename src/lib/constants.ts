import type { UserRow } from "@/lib/types/users";
import type { ColumnOption } from "./types/table";

const FILTER_KEYS: Array<keyof UserRow> = ["name", "email"];

export const USER_COLUMNS: ColumnOption[] = FILTER_KEYS.map((key) => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
  type: "text",
}));
