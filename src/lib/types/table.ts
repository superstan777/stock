import type { UserRow } from "./users";
import type { DeviceForTable } from "./devices";
import type { TicketRow } from "./tickets";

export interface ColumnOption {
  value: string;
  label: string;
  type?: "text" | "select";
  options?: string[]; // np. enum values
}

export type EntityType = "user" | "computer" | "monitor" | "ticket";

export type EntityDataMap = {
  user: UserRow;
  computer: DeviceForTable;
  monitor: DeviceForTable;
  ticket: TicketRow;
};

export type EntityData<T extends EntityType> = EntityDataMap[T];

export type PagesType = {
  current: number;
  total: number;
};
