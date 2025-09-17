import { DeviceType } from "@/lib/types/devices";
import type {
  DeviceRow,
  DeviceInsert,
  DeviceUpdate,
} from "@/lib/types/devices";
import type { ComputerFilterKeyType, MonitorFilterKeyType } from "../constants";

const API_BASE = "/api/devices";

export const getDevices = async (
  deviceType: DeviceType,
  options?: {
    filter?: ComputerFilterKeyType | MonitorFilterKeyType;
    query?: string;
    page?: number;
    perPage?: number;
  }
): Promise<{ data: DeviceRow[]; count: number }> => {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.perPage) params.set("perPage", String(options.perPage));
  if (options?.filter) params.set("filter", options.filter);
  if (options?.query) params.set("query", options.query);

  const res = await fetch(`${API_BASE}/${deviceType}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch devices");
  return res.json();
};

export const addDevice = async (
  deviceType: DeviceType,
  device: DeviceInsert
): Promise<DeviceRow[]> => {
  const res = await fetch(`${API_BASE}/${deviceType}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(device),
  });
  if (!res.ok) throw new Error("Failed to add device");
  return res.json();
};

export const updateDevice = async (
  deviceType: DeviceType,
  id: string,
  updates: DeviceUpdate
): Promise<DeviceRow[]> => {
  const res = await fetch(`${API_BASE}/${deviceType}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error("Failed to update device");
  return res.json();
};

export const removeDevice = async (
  deviceType: DeviceType,
  id: string
): Promise<DeviceRow[]> => {
  const res = await fetch(`${API_BASE}/${deviceType}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete device");
  return res.json();
};
