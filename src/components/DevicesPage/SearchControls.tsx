"use client";

import React, { useState, useEffect } from "react";
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
import { Constants } from "@/lib/types/supabase";
import { columns } from "./DevicesPage";

type InstallStatus = (typeof Constants.public.Enums.install_status)[number];

interface SearchControlsProps {
  pathname: string;
}

export const SearchControls = ({ pathname }: SearchControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilter, setSelectedFilter] = useState<string>(
    columns[0].value
  );
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const filter = searchParams.get("filter");
    const query = searchParams.get("query");

    if (filter) setSelectedFilter(filter);
    setInputValue(query || "");
  }, [searchParams]);

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
    setInputValue("");
    const params = new URLSearchParams(searchParams);

    const originalFilter = searchParams.get("filter");
    if (originalFilter) {
      params.set("filter", selectedFilter);
    } else {
      params.delete("filter");
    }

    params.delete("query");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (value: string) => {
    const previousFilter = selectedFilter;
    setSelectedFilter(value);

    if (value === "install_status" || previousFilter === "install_status") {
      setInputValue("");
    }
  };

  const handleStatusChange = (value: InstallStatus) => {
    setInputValue(value);
  };

  const hasSomethingToClear = inputValue.trim() !== "";

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

      {selectedFilter === "install_status" ? (
        <Select
          value={inputValue as InstallStatus}
          onValueChange={handleStatusChange}
          aria-label="Select status"
        >
          <SelectTrigger aria-label="Select status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Constants.public.Enums.install_status.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
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
          aria-label="Search"
        />
      )}

      <Button onClick={handleSearch} aria-label="Search">
        Search
      </Button>
      <Button
        variant="outline"
        onClick={handleClear}
        disabled={!hasSomethingToClear}
        aria-label="Clear"
      >
        Clear
      </Button>
    </>
  );
};
