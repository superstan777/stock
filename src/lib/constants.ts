import type { UserRow } from "@/lib/types/users";
import type { ColumnOption } from "./types/table";
import type { ComputerRow, MonitorRow, InstallStatus } from "./types/devices";
import { Constants } from "@/lib/types/supabase";
import { TicketRow } from "./types/tickets";

function formatLabel(key: string): string {
  return key
    .split("_")
    .map((word) => {
      if (word.toLowerCase() === "id") return "ID"; // special case
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Tickets
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

// Users
type AllUserKeys = keyof UserRow;
export type UserFilterKeyType = Exclude<AllUserKeys, "id" | "created_at">;

const USER_FILTER_KEYS: Array<keyof UserRow> = ["name", "email"];

export const USER_COLUMNS: ColumnOption[] = USER_FILTER_KEYS.map((key) => ({
  value: key,
  label: formatLabel(key),
  type: "text",
}));

// Computers
type AllComputerKeys = keyof ComputerRow;
export type ComputerFilterKeyType = Exclude<
  AllComputerKeys,
  "id" | "created_at" | "user_id"
>;

const COMPUTER_FILTER_KEYS: Array<ComputerFilterKeyType | "user_email"> = [
  "serial_number",
  "model",
  "order_id",
  "install_status",
  "user_email",
];

export const COMPUTER_COLUMNS: ColumnOption[] = COMPUTER_FILTER_KEYS.map(
  (key) => {
    if (key === "install_status") {
      return {
        value: key,
        label: formatLabel(key),
        type: "select",
        options: Object.values(
          Constants.public.Enums.install_status
        ) as InstallStatus[],
      };
    }

    return {
      value: key,
      label: formatLabel(key),
      type: "text",
    };
  }
);

// Monitors
type AllMonitorKeys = keyof MonitorRow;
export type MonitorFilterKeyType = Exclude<
  AllMonitorKeys,
  "id" | "created_at" | "user_id"
>;

const MONITOR_FILTER_KEYS: Array<MonitorFilterKeyType | "user_email"> = [
  "serial_number",
  "model",
  "order_id",
  "install_status",
  "user_email",
];

export const MONITOR_COLUMNS: ColumnOption[] = MONITOR_FILTER_KEYS.map(
  (key) => {
    if (key === "install_status") {
      return {
        value: key,
        label: formatLabel(key),
        type: "select",
        options: Object.values(
          Constants.public.Enums.install_status
        ) as InstallStatus[],
      };
    }

    return {
      value: key,
      label: formatLabel(key),
      type: "text",
    };
  }
);
