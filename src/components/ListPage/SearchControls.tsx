"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import type { ColumnOption, EntityType } from "@/lib/types/table";
import { DatePicker } from "../ui/date-picker";
import { formatLocalDate } from "@/lib/utils";

interface SearchControlsProps<T extends EntityType> {
  pathname: string;
  columns: ColumnOption<T>[];
}

export const SearchControls = <T extends EntityType>({
  pathname,
  columns,
}: SearchControlsProps<T>) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilter, setSelectedFilter] = useState<string>(
    columns[0]?.value || ""
  );
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const currentValue = searchParams.get(selectedFilter);
    setInputValue(currentValue || "");
  }, [searchParams, selectedFilter]);

  const selectedColumn = columns.find((col) => col.value === selectedFilter);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (inputValue.trim()) {
      params.set(selectedFilter, inputValue.trim());
    } else {
      params.delete(selectedFilter);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    columns.forEach((col) => params.delete(col.value));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    setInputValue("");
  };

  const hasSomethingToClear = useMemo(() => {
    return columns.some((col) => searchParams.get(col.value));
  }, [searchParams, columns]);

  return (
    <div className="flex gap-2 items-end">
      {/* 🔹 wybór filtra */}
      <Select value={selectedFilter} onValueChange={handleFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          {columns.map((col) => (
            <SelectItem key={col.value} value={col.value}>
              {col.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 🔹 input / date */}
      {selectedColumn?.type === "date" ? (
        <DatePicker
          label={selectedColumn.label}
          value={inputValue ? new Date(inputValue) : null}
          onChange={(val) => {
            setInputValue(val ? formatLocalDate(val) : "");
          }}
        />
      ) : (
        <Input
          type="text"
          placeholder="Search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      )}

      <Button onClick={handleSearch}>Search</Button>
      <Button
        variant="outline"
        onClick={handleClear}
        disabled={!hasSomethingToClear}
      >
        Clear
      </Button>
    </div>
  );
};
