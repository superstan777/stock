import { Database } from "../types/supabase";

export type DevicesColumnType = {
  label: string;
  value: string;
};

export type DeviceType = Database["public"]["Enums"]["device_type"];
export type InstallStatus = Database["public"]["Enums"]["install_status"];

export type DeviceRow = Database["public"]["Tables"]["devices"]["Row"];
export type DeviceInsert = Database["public"]["Tables"]["devices"]["Insert"];
export type DeviceUpdate = Database["public"]["Tables"]["devices"]["Update"];
