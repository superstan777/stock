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
import { ALL_INSTALL_STATUSES } from "@/lib/consts/devices";
const supabase = createClient();

export interface DeviceFilter {
  key: ComputerFilterKeyType | MonitorFilterKeyType | string;
  value: string;
}

export const getDevices = async (
  deviceType: DeviceType,
  filters: DeviceFilter[] = [],
  page: number = 1,
  perPage: number = 20
): Promise<{ data: DeviceRow[]; count: number }> => {
  let q = supabase
    .from("devices")
    .select("*", { count: "exact" })
    .eq("device_type", deviceType)
    .order("serial_number", { ascending: true });

  for (const { key, value } of filters) {
    if (!value) continue;

    const values = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (key === "install_status") {
      const matchingStatuses = ALL_INSTALL_STATUSES.filter((status) =>
        values.some((v) => status.toLowerCase().includes(v.toLowerCase()))
      );

      if (matchingStatuses.length > 0) {
        q = q.in(key, matchingStatuses as InstallStatus[]);
      } else {
        q = q.eq(key, "__no_match__" as InstallStatus);
      }
    } else if (key === "id" || key === "serial_number") {
      if (values.length > 1) {
        q = q.or(values.map((v) => `${key}.ilike.${v}%`).join(","));
      } else {
        q = q.ilike(key, `${values[0]}%`);
      }
    } else {
      if (values.length > 1) {
        q = q.or(values.map((v) => `${key}.ilike.${v}%`).join(","));
      } else {
        q = q.ilike(key, `${values[0]}%`);
      }
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
