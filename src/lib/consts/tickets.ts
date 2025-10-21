import type { TicketRow } from "../types/tickets";
import type { ColumnOption } from "../types/table";
import { formatLabel } from "../utils";

type AllTicketKeys = keyof TicketRow;

export type TicketFilterKeyType = Exclude<
  AllTicketKeys,
  "id" | "created_at" | "description" | "caller_id"
>;

const TICKET_FILTER_KEYS = [
  "number",
  "title",
  "status",
  "caller.email",
  "assigned_to.email",
  "estimated_resolution_date",
  "resolution_date",
] as const;

export const TICKET_COLUMNS: ColumnOption[] = TICKET_FILTER_KEYS.map((key) => {
  if (key === "number") {
    return {
      value: key,
      label: formatLabel(key),
      type: "text" as const,
      route: "tickets",
      routeIdPath: "id",
    };
  }

  if (key === "caller.email") {
    return {
      value: key,
      label: formatLabel(key),
      type: "text",
      route: "users",
      routeIdPath: "caller.id",
    };
  }

  if (key === "estimated_resolution_date" || key === "resolution_date") {
    return {
      value: key,
      label: formatLabel(key),
      type: "date",
    };
  }

  return {
    value: key,
    label: formatLabel(key),
    type: "text",
  };
});

const USER_TICKETS_FILTER_KEYS: Array<TicketFilterKeyType> = [
  "number",
  "title",
  "status",
];

export const USER_TICKETS_COLUMNS: ColumnOption[] =
  USER_TICKETS_FILTER_KEYS.map((key) => {
    if (key === "number") {
      return {
        value: key,
        label: formatLabel(key),
        type: "text",
        route: "tickets",
        routeIdPath: "id",
      };
    }

    return {
      value: key,
      label: formatLabel(key),
      type: "text",
    };
  });
