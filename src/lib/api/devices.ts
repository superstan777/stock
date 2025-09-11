import { DeviceType } from "../types/devices";
import { createClient } from "@/lib/supabase/client";
import type {
  InstallStatus,
  DeviceRow,
  DeviceUpdate,
  DeviceInsert,
} from "../types/devices";

const supabase = createClient();

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
      q = q.eq(filter, query as InstallStatus);
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

  if (updates.install_status && updates.install_status !== "Deployed") {
    updates.user_id = null;
  }

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
