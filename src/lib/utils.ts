import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

export function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
