import { createClient } from "@/lib/supabase/client";
import type {
  DeviceType,
  InstallStatus,
  DeviceRow,
  DeviceUpdate,
  DeviceInsert,
} from "../types/devices";
import type { ComputerFilterKeyType } from "../consts/computers";
import type { MonitorFilterKeyType } from "../consts/monitors";

const supabase = createClient();

export const getDevices = async (
  deviceType: DeviceType,
  filter?: ComputerFilterKeyType | MonitorFilterKeyType,
  query?: string,
  page: number = 1,
  perPage: number = 20
): Promise<{ data: DeviceRow[]; count: number }> => {
  const selectFields = `
  *
  `;

  let q = supabase
    .from("devices")
    .select(selectFields, { count: "exact" })
    .eq("device_type", deviceType)
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
  if (!data) return { data: [], count: 0 };

  return { data: data as DeviceRow[], count: count ?? 0 };
};

export const addDevice = async (device: DeviceInsert): Promise<DeviceRow[]> => {
  const { data, error } = await supabase.from("devices").insert([device]);
  if (error) throw error;
  return data ?? [];
};

export const updateDevice = async (
  id: string,
  updates: DeviceUpdate
): Promise<DeviceRow[]> => {
  const { data, error } = await supabase
    .from("devices")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
  return data ?? [];
};

export const deleteDevice = async (id: string): Promise<DeviceRow[]> => {
  const { data, error } = await supabase.from("devices").delete().eq("id", id);
  if (error) throw error;
  return data ?? [];
};

export const getDevice = async (id: string): Promise<DeviceRow | null> => {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return data as DeviceRow;
};

export const getAllDevices = async (): Promise<DeviceRow[]> => {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .order("device_type", { ascending: true })
    .order("serial_number", { ascending: true });

  if (error) throw error;
  return data ?? [];
};
