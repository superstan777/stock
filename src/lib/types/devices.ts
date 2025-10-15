import { Database } from "../types/supabase";

export type DevicesColumnType = {
  label: string;
  value: string;
};

export type DeviceType = Database["public"]["Enums"]["device_type"];
export type InstallStatus = Database["public"]["Enums"]["install_status"];

export type ComputerRow = Database["public"]["Tables"]["computers"]["Row"];
export type ComputerInsert =
  Database["public"]["Tables"]["computers"]["Insert"];
export type ComputerUpdate =
  Database["public"]["Tables"]["computers"]["Update"];

export type ComputerWithUser = Omit<ComputerRow, "user_id"> & {
  user: { id: string; email: string | null } | null;
};

export type MonitorRow = Database["public"]["Tables"]["monitors"]["Row"];
export type MonitorInsert = Database["public"]["Tables"]["monitors"]["Insert"];
export type MonitorUpdate = Database["public"]["Tables"]["monitors"]["Update"];

export type MonitorWithUser = Omit<MonitorRow, "user_id"> & {
  user: { id: string; email: string | null } | null;
};

export type DeviceRow = ComputerRow | MonitorRow;
export type DeviceInsert = ComputerInsert | MonitorInsert;
export type DeviceUpdate = ComputerUpdate | MonitorUpdate;
export type DeviceWithUser = ComputerWithUser | MonitorWithUser;

export type DeviceForTable = Omit<DeviceWithUser, "user"> & {
  user: { id: string; email: string | null } | null;
};
