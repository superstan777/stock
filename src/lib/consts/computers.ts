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

// User Computers

const USER_COMPUTERS_FILTER_KEYS: Array<ComputerFilterKeyType> = [
  "serial_number",
  "model",
  "order_id",
  "install_status",
];

export const USER_COMPUTERS_COLUMNS: ColumnOption[] =
  USER_COMPUTERS_FILTER_KEYS.map((key) => {
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
        clickable: true,
        route: "computer",
        routeIdPath: "id",
      };
    }

    return {
      value: key,
      label: formatLabel(key),
      type: "text",
    };
  });
