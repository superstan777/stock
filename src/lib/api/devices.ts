import { DeviceType } from "../types/devices";
import { createClient } from "@/lib/supabase/client";
import type {
  InstallStatus,
  DeviceRow,
  DeviceUpdate,
  DeviceInsert,
  DeviceWithUser,
  DeviceForTable,
} from "../types/devices";
import type { ComputerFilterKeyType } from "../consts/computers";
import type { MonitorFilterKeyType } from "../consts/monitors";

const supabase = createClient();

const getTableName = (deviceType: DeviceType): "computers" | "monitors" =>
  deviceType === "computer" ? "computers" : "monitors";

export const getDevices = async (
  deviceType: DeviceType,
  filter?: ComputerFilterKeyType | MonitorFilterKeyType | "user.email",
  query?: string,
  page: number = 1,
  perPage: number = 20
): Promise<{ data: DeviceForTable[]; count: number }> => {
  const tableName = getTableName(deviceType);

  const selectUser =
    filter === "user.email"
      ? "user:users!inner(id, email)"
      : "user:users(id, email)";

  const selectFields = `
    id,
    serial_number,
    model,
    order_id,
    install_status,
    ${selectUser}
  `;

  let q = supabase
    .from(tableName)
    .select(selectFields, { count: "exact" })
    .order("serial_number", { ascending: true });

  if (filter && query) {
    if (filter === "install_status") {
      q = q.eq(filter, query as InstallStatus);
    } else if (filter === "user.email") {
      q = q.ilike("user.email", `${query}%`);
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

  const typedData = data as unknown as DeviceWithUser[];

  const mappedData: DeviceForTable[] = typedData.map(({ user, ...device }) => ({
    ...device,
    user: user ? { id: user.id, email: user.email } : null,
  }));

  return { data: mappedData, count: count ?? 0 };
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

export const getUserDevices = async (
  deviceType: DeviceType,
  userId: string
): Promise<DeviceForTable[]> => {
  const tableName = getTableName(deviceType);

  const { data, error } = await supabase
    .from(tableName)
    .select(
      `
      id,
      serial_number,
      model,
      order_id,
      install_status,
      user:users(id, email)
    `
    )
    .eq("user_id", userId)
    .order("serial_number", { ascending: true });

  if (error) throw error;

  return (data as DeviceWithUser[]).map(({ user, ...device }) => ({
    ...device,
    user: user ? { id: user.id, email: user.email } : null,
  }));
};

export const getDevice = async (
  deviceType: DeviceType,
  id: string
): Promise<DeviceForTable | null> => {
  const tableName = getTableName(deviceType);

  const { data, error } = await supabase
    .from(tableName)
    .select(
      `
      id,
      serial_number,
      model,
      order_id,
      install_status,
      user:users(id, email)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const { user, ...device } = data as DeviceWithUser;

  return {
    ...device,
    user: user ? { id: user.id, email: user.email } : null,
  };
};
