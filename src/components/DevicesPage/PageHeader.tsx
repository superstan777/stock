"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeviceType } from "@/lib/types/devices";
import { DeviceDialog } from "./DeviceDialog";

import { Constants } from "@/lib/types/supabase";
import { Button } from "../ui/button";
import { columns } from "./DevicesPage";

type InstallStatus = (typeof Constants.public.Enums.install_status)[number];

interface DevicesPageProps {
  deviceType: DeviceType;
}

export const PageHeader = ({ deviceType }: DevicesPageProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilter, setSelectedFilter] = useState<string>(
    columns[0].value
  );
  const [inputValue, setInputValue] = useState("");

  const createTitle = (path: string) => {
    if (path === "/") return "Dashboard";

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
  };

  const title = createTitle(pathname);

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

  const hasSomethingToClear =
    inputValue !== "" ||
    (selectedFilter === "install_status" && inputValue !== "");

  // const hasSomethingToClear = inputValue.trim() !== "";

  return (
    <header className="flex items-center justify-between mb-4 gap-2">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>

        <Select
          value={selectedFilter}
          onValueChange={(value) => {
            const previousfilter = selectedFilter;
            setSelectedFilter(value);

            if (
              value === "install_status" ||
              previousfilter === "install_status"
            ) {
              setInputValue("");
            }
          }}
        >
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

        {selectedFilter === "install_status" ? (
          <Select
            value={inputValue as InstallStatus}
            onValueChange={(v) => setInputValue(v as InstallStatus)}
          >
            <SelectTrigger>
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

      <DeviceDialog
        mode="add"
        deviceType={deviceType}
        trigger={
          <Button className="inline-flex items-center gap-2">
            {deviceType === "computer" ? "Add Computer" : "Add Monitor"}
          </Button>
        }
      />
    </header>
  );
};
