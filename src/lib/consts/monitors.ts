import type { DeviceRow } from "../types/devices";
import type { ColumnOption } from "../types/table";
import { formatLabel } from "../utils";
import { Constants } from "@/lib/types/supabase";
import type { InstallStatus } from "../types/devices";

type AllMonitorKeys = keyof DeviceRow;
export type MonitorFilterKeyType = Exclude<AllMonitorKeys, "id" | "created_at">;

const MONITOR_FILTER_KEYS = [
  "serial_number",
  "model",
  "order_id",
  "install_status",
] as const;

export const MONITOR_COLUMNS: ColumnOption[] = MONITOR_FILTER_KEYS.map(
  (key) => {
    if (key === "install_status") {
      return {
        value: key,
        label: formatLabel(key),
        type: "select",
        options: Object.values(
          Constants.public.Enums.install_status
        ) as InstallStatus[],
      };
    }

    if (key === "serial_number") {
      return {
        value: key,
        label: formatLabel(key),
        type: "text",
        route: "monitors",
        routeIdPath: "id",
      };
    }

    return {
      value: key,
      label: formatLabel(key),
      type: "text",
    };
  }
);

// User Monitors

const USER_MONITORS_FILTER_KEYS: Array<MonitorFilterKeyType> = [
  "serial_number",
  "model",
  "order_id",
  "install_status",
];

export const USER_MONITORS_COLUMNS: ColumnOption[] =
  USER_MONITORS_FILTER_KEYS.map((key) => {
    if (key === "install_status") {
      return {
        value: key,
        label: formatLabel(key),
        type: "select",
        options: Object.values(
          Constants.public.Enums.install_status
        ) as InstallStatus[],
      };
    }

    return {
      value: key,
      label: formatLabel(key),
      type: "text",
    };
  });
