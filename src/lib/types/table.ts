import type { UserRow } from "./users";
import type { DeviceRow } from "./devices";
import type { TicketRow, TicketWithUsers } from "./tickets";

export interface ColumnOption {
  value: string;
  label: string;
  type?: "text" | "select";
  options?: string[];
  route?: string;
  routeIdPath?: string;
}

export type EntityType = "user" | "computer" | "monitor" | "ticket";

export type EntityDataMap = {
  user: UserRow;
  computer: DeviceRow;
  monitor: DeviceRow;
  ticket: TicketWithUsers | TicketRow;
};

export type EntityData<T extends EntityType> = EntityDataMap[T];

export type PagesType = {
  current: number;
  total: number;
};
