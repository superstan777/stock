import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLabel(key: string): string {
  const lastPart = key.includes(".") ? key.split(".").pop()! : key;

  return lastPart
    .split("_")
    .map((word) => {
      if (word.toLowerCase() === "id") return "ID"; // specjalny przypadek
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Formatuje datę do lokalnego czasu użytkownika.
 * @example formatDate("2025-10-11T22:04:33Z") -> "12.10.2025"
 */
export function formatDate(input: string | Date): string {
  const date = typeof input === "string" ? parseISO(input) : input;
  const zoned = toZonedTime(date, LOCAL_TZ);
  return format(zoned, "dd.MM.yyyy");
}

/**
 * Zwraca lokalną datę w formacie YYYY-MM-DD (np. do wysyłania do API lub filtrowania).
 * @example formatLocalDate("2025-10-11T22:04:33Z") -> "2025-10-12"
 */
export function formatLocalDate(input: string | Date): string {
  const date = typeof input === "string" ? parseISO(input) : input;
  const zoned = toZonedTime(date, LOCAL_TZ);
  return format(zoned, "yyyy-MM-dd");
}
