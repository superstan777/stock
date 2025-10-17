import type { ColumnOption } from "../types/table";
import { formatLabel } from "../utils";

export type RelationFilterKeyType =
  | "user.email"
  | "device.serial_number"
  | "device.model"
  | "device.device_type";

const RELATION_FILTER_KEYS: RelationFilterKeyType[] = [
  "user.email",
  "device.serial_number",
  "device.model",
  "device.device_type",
];

export const RELATION_COLUMNS: ColumnOption<"relation">[] =
  RELATION_FILTER_KEYS.map((key) => {
    if (key === "device.serial_number") {
      return {
        value: key,
        label: formatLabel(key),
        routeIdPath: "device.id",
        getRoute: (row) =>
          row.device.device_type === "computer" ? "computers" : "monitors",
      };
    }
    if (key === "user.email") {
      return {
        value: key,
        label: formatLabel(key),
        route: "users",
        routeIdPath: "user.id",
      };
    }
    return { value: key, label: formatLabel(key) };
  });
