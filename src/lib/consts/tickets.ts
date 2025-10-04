import type { TicketRow } from "../types/tickets";
import { formatLabel } from "../utils";
import type { ColumnOption } from "../types/table";

type AllTicketKeys = keyof TicketRow;
export type TicketFilterKeyType = Exclude<
  AllTicketKeys,
  "id" | "created_at" | "description" | "caller_id"
>;

const TICKET_FILTER_KEYS: Array<TicketFilterKeyType | "caller_email"> = [
  "number",
  "title",
  "caller_email",
  "status",
  "assigned_to",
];

export const TICKET_COLUMNS: ColumnOption[] = TICKET_FILTER_KEYS.map((key) => ({
  value: key,
  label: formatLabel(key),
  type: "text",
}));

// User Tickets

const USER_TICKETS_FILTER_KEYS: Array<TicketFilterKeyType> = [
  "number",
  "title",
  "status",
  "assigned_to",
];

export const USER_TICKETS_COLUMNS: ColumnOption[] =
  USER_TICKETS_FILTER_KEYS.map((key) => ({
    value: key,
    label: formatLabel(key),
    type: "text",
  }));
