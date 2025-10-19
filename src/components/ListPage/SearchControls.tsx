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
    const filter = searchParams.get("filter");
    const query = searchParams.get("query");

    if (filter && columns.some((col) => col.value === filter)) {
      setSelectedFilter(filter);
    }
    setInputValue(query || "");
  }, [searchParams, columns]);

  const handleSearch = () => {
    if (inputValue.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set("filter", selectedFilter);
      params.set("query", inputValue.trim());
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("filter");
    params.delete("query");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    setInputValue("");
  };

  const handleSelectValueChange = (value: string) => {
    setInputValue(value);
  };

  const hasSomethingToClear = useMemo(() => {
    const filter = searchParams.get("filter");
    const query = searchParams.get("query");
    return Boolean(filter && query);
  }, [searchParams]);

  const selectedColumn = columns.find((col) => col.value === selectedFilter);

  return (
    <>
      <Select
        value={selectedFilter}
        onValueChange={handleFilterChange}
        aria-label="Filter by"
      >
        <SelectTrigger aria-label="Filter by">
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

      {selectedColumn?.type === "select" && selectedColumn.options ? (
        <Select
          value={inputValue}
          onValueChange={handleSelectValueChange}
          aria-label="Select value"
        >
          <SelectTrigger aria-label="Select value">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {selectedColumn.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type="text"
          placeholder="Search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          aria-label="Search input"
        />
      )}

      <Button onClick={handleSearch} aria-label="Search button">
        Search
      </Button>

      <Button
        variant="outline"
        onClick={handleClear}
        disabled={!hasSomethingToClear}
        aria-label="Clear button"
      >
        Clear
      </Button>
    </>
  );
};
