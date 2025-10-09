import type { UserRow } from "./users";
import type { DeviceForTable } from "./devices";
import type { TicketRow, TicketWithUsers } from "./tickets";

export interface ColumnOption {
  value: string;
  label: string;
  type?: "text" | "select";
  options?: string[]; // np. enum values
  route?: string;
  routeIdPath?: string;
}

export type EntityType = "user" | "computer" | "monitor" | "ticket";

export type EntityDataMap = {
  user: UserRow;
  computer: DeviceForTable;
  monitor: DeviceForTable;
  ticket: TicketWithUsers | TicketRow;
};

export type EntityData<T extends EntityType> = EntityDataMap[T];

export type PagesType = {
  current: number;
  total: number;
};
