import type { UserRow } from "../types/users";
import type { ColumnOption } from "../types/table";
import { formatLabel } from "../utils";

type AllUserKeys = keyof UserRow;
export type UserFilterKeyType = Exclude<AllUserKeys, "id" | "created_at">;

const USER_FILTER_KEYS: Array<keyof UserRow> = ["name", "email"];

export const USER_COLUMNS: ColumnOption[] = USER_FILTER_KEYS.map((key) => {
  if (key === "name") {
    return {
      value: key,
      label: formatLabel(key),
      type: "text",
      route: "users",
      routeIdPath: "id",
    };
  }

  return {
    value: key,
    label: formatLabel(key),
    type: "text",
  };
});
