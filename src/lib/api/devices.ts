import { supabase } from "../supabaseClient";
import { Database } from "../types/supabase";
import { DeviceType } from "../types/devices";

// Computer types
type ComputerRow = Database["public"]["Tables"]["computers"]["Row"];
type ComputerInsert = Database["public"]["Tables"]["computers"]["Insert"];
type ComputerUpdate = Database["public"]["Tables"]["computers"]["Update"];

// Monitor types
type MonitorRow = Database["public"]["Tables"]["monitors"]["Row"];
type MonitorInsert = Database["public"]["Tables"]["monitors"]["Insert"];
type MonitorUpdate = Database["public"]["Tables"]["monitors"]["Update"];

// Union types
type DeviceRow = ComputerRow | MonitorRow;
type DeviceInsert = ComputerInsert | MonitorInsert;
type DeviceUpdate = ComputerUpdate | MonitorUpdate;

// Generic device functions
const getTableName = (deviceType: DeviceType): "computers" | "monitors" => {
  return deviceType === "computer" ? "computers" : "monitors";
};

export const getDevices = async (
  deviceType: DeviceType,
  filter?: "serial_number" | "model" | "order_id" | "install_status",
  query?: string,
  page: number = 1,
  perPage: number = 20
): Promise<{ data: DeviceRow[]; count: number }> => {
  const tableName = getTableName(deviceType);

  let q = supabase
    .from(tableName)
    .select("*", { count: "exact" })
    .order("serial_number", { ascending: true });

  if (filter && query) {
    if (filter === "install_status") {
      q = q.eq(filter, query);
    } else {
      q = q.ilike(filter, `${query}%`);
    }
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};

export const addDevice = async (
  deviceType: DeviceType,
  device: DeviceInsert
): Promise<DeviceRow[]> => {
  const tableName = getTableName(deviceType);
  const { data, error } = await supabase.from(tableName).insert([device]);
  if (error) throw error;
  return data ?? [];
};

export const updateDevice = async (
  deviceType: DeviceType,
  id: string,
  updates: DeviceUpdate
): Promise<DeviceRow[]> => {
  const tableName = getTableName(deviceType);
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq("id", id);
  if (error) throw error;
  return data ?? [];
};

export const deleteDevice = async (
  deviceType: DeviceType,
  id: string
): Promise<DeviceRow[]> => {
  const tableName = getTableName(deviceType);
  const { data, error } = await supabase.from(tableName).delete().eq("id", id);
  if (error) throw error;
  return data ?? [];
};
