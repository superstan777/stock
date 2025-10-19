import { Database } from "../types/supabase";
import type { DeviceRow } from "./devices";
import type { UserRow } from "./users";

export type DevicesColumnType = {
  label: string;
  value: string;
};

export type RelationRow = Database["public"]["Tables"]["relations"]["Row"];
export type RelationInsert =
  Database["public"]["Tables"]["relations"]["Insert"];
export type RelationUpdate =
  Database["public"]["Tables"]["relations"]["Update"];

export type RelationWithDetails = Omit<RelationRow, "user_id" | "device_id"> & {
  user: UserRow;
  device: DeviceRow;
};
