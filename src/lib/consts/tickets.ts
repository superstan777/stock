import type { TicketRow } from "../types/tickets";
import type { ColumnOption } from "../types/table";
import { formatLabel } from "../utils";

type AllTicketKeys = keyof TicketRow;

export type TicketFilterKeyType = Exclude<
  AllTicketKeys,
  "id" | "created_at" | "description" | "caller_id" | "assigned_to"
>;

const TICKET_FILTER_KEYS = [
  "number",
  "title",
  "status",
  "caller.email",
  "assigned_to.email",
] as const;

export const TICKET_COLUMNS: ColumnOption[] = TICKET_FILTER_KEYS.map((key) => ({
  value: key,
  label: formatLabel(key),
  type: "text",
}));

const USER_TICKETS_FILTER_KEYS: Array<TicketFilterKeyType> = [
  "number",
  "title",
  "status",
];

export const USER_TICKETS_COLUMNS: ColumnOption[] =
  USER_TICKETS_FILTER_KEYS.map((key) => ({
    value: key,
    label: formatLabel(key),
    type: "text",
  }));
