import { DeviceType } from "../types/devices";
import { DeviceRow, DeviceInsert, DeviceUpdate } from "../types/devices";

export async function getDevices(
  deviceType: DeviceType,
  filter?: "serial_number" | "model" | "order_id" | "install_status",
  query?: string,
  page: number = 1,
  perPage: number = 20
) {
  const url = new URL(`/api/devices/${deviceType}`, window.location.origin);
  url.searchParams.set("page", String(page));
  url.searchParams.set("perPage", String(perPage));
  if (filter) url.searchParams.set("filter", filter);
  if (query) url.searchParams.set("query", query);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch devices");
  return res.json();
}

export async function addDevice(
  deviceType: DeviceType,
  device: DeviceInsert
): Promise<DeviceRow[]> {
  const res = await fetch(`/api/devices/${deviceType}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(device),
  });
  if (!res.ok) throw new Error("Failed to add device");
  return res.json();
}

export async function updateDevice(
  deviceType: DeviceType,
  id: string,
  updates: DeviceUpdate
): Promise<DeviceRow[]> {
  const res = await fetch(`/api/devices/${deviceType}?id=${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update device");
  return res.json();
}
