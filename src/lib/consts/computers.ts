import type { DeviceRow } from "../types/devices";
import type { ColumnOption } from "../types/table";
import { formatLabel } from "../utils";
import { Constants } from "@/lib/types/supabase";
import type { InstallStatus } from "../types/devices";

type AllComputerKeys = keyof DeviceRow;
export type ComputerFilterKeyType = Exclude<
  AllComputerKeys,
  "id" | "created_at"
>;

const COMPUTER_FILTER_KEYS = [
  "serial_number",
  "model",
  "order_id",
  "install_status",
] as const;

export const COMPUTER_COLUMNS: ColumnOption[] = COMPUTER_FILTER_KEYS.map(
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
        route: "computers",
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

// ===========================
// User Computers (from relations)
// ===========================

// SERIAL, MODEL, DEVICE TYPE, START DATE, END DATE
export const USER_PAGE_COMPUTERS_COLUMNS: ColumnOption[] = [
  {
    value: "serial_number",
    label: "Serial Number",
    type: "text",
    route: "computer",
    routeIdPath: "id",
  },
  {
    value: "model",
    label: "Model",
    type: "text",
  },
  {
    value: "device_type",
    label: "Device Type",
    type: "text",
  },
];

// EMAIL, START DATE, END DATE
export const DEVICE_PAGE_COMPUTERS_COLUMNS: ColumnOption[] = [
  {
    value: "model",
    label: "Model",
    type: "text",
  },
  {
    value: "device_type",
    label: "Device Type",
    type: "text",
  },
];
