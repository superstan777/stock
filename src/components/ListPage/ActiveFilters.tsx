"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatLabel } from "@/lib/utils";

export const ActiveFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: { key: string; values: string[] }[] = [];

  searchParams.forEach((value, key) => {
    if (key !== "page" && value) {
      const splitValues = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      filters.push({ key, values: splitValues });
    }
  });

  if (filters.length === 0) return null;

  const handleRemove = (key: string, valueToRemove?: string) => {
    const params = new URLSearchParams(searchParams);

    if (valueToRemove) {
      const existingValues = params.get(key)?.split(",") || [];
      const updatedValues = existingValues.filter(
        (v) => v.trim() !== valueToRemove
      );

      if (updatedValues.length > 0) {
        params.set(key, updatedValues.join(","));
      } else {
        params.delete(key);
      }
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 flex-wrap mt-2">
      {filters.map(({ key, values }) => {
        const label = formatLabel(key);

        if (values.length > 1) {
          return (
            <Badge
              key={key}
              className="flex items-center gap-1 flex-wrap pr-1"
              onRemove={() => handleRemove(key)}
            >
              {label}:
              {values.map((v) => (
                <Badge
                  key={v}
                  variant="secondary"
                  className="ml-1 flex items-center gap-1"
                  onRemove={() => handleRemove(key, v)}
                >
                  {v}
                </Badge>
              ))}
            </Badge>
          );
        }

        return (
          <Badge
            key={key}
            className="flex items-center gap-1 pr-1"
            onRemove={() => handleRemove(key)}
          >
            {label}: <span className="ml-1 font-medium">{values[0]}</span>
          </Badge>
        );
      })}
    </div>
  );
};
