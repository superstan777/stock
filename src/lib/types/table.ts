import type { UserRow } from "./users";
import type { DeviceRow } from "./devices";

export interface ColumnOption {
  value: string;
  label: string;
  type?: "text" | "select";
  options?: string[]; // np. enum values
}

export type EntityType = "user" | "computer" | "monitor";

// Mapa typu danych dla każdego entity
export type EntityDataMap = {
  user: UserRow;
  computer: DeviceRow;
  monitor: DeviceRow;
};

// Generyk dla pojedynczej jednostki danych
export type EntityData<T extends EntityType> = EntityDataMap[T];
