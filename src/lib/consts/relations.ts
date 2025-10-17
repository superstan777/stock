import type { ColumnOption } from "../types/table";
import { formatLabel } from "../utils";

export type RelationFilterKeyType =
  | "user.email"
  | "device.serial_number"
  | "device.model"
  | "device.device_type"
  | "start_date"
  | "end_date";

const RELATION_FILTER_KEYS: RelationFilterKeyType[] = [
  "user.email",
  "device.serial_number",
  "device.model",
  "device.device_type",
  "start_date",
  "end_date",
];

export const RELATION_COLUMNS: ColumnOption<"relation">[] =
  RELATION_FILTER_KEYS.map((key) => {
    // 🔹 Kolumna — serial number → link do konkretnego urządzenia
    if (key === "device.serial_number") {
      return {
        value: key,
        label: formatLabel(key),
        routeIdPath: "device.id",
        getRoute: (row) =>
          row.device.device_type === "computer" ? "computers" : "monitors",
      };
    }

    // 🔹 Kolumna — email użytkownika → link do usera
    if (key === "user.email") {
      return {
        value: key,
        label: formatLabel(key),
        route: "users",
        routeIdPath: "user.id",
      };
    }

    // 🔹 Kolumny z datami — formatowanie dat
    if (key === "start_date" || key === "end_date") {
      return {
        value: key,
        label: formatLabel(key),
        type: "text",
        format: "date",
      };
    }

    // 🔹 Domyślnie kolumna tekstowa (np. model, type)
    return {
      value: key,
      label: formatLabel(key),
      type: "text",
    };
  });
