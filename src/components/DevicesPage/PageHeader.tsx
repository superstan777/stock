"use client";

import React from "react";
import { DeviceType } from "@/lib/types/devices";
import { DeviceDialog } from "./DeviceDialog";
import { Button } from "../ui/button";
import { SearchControls } from "./SearchControls";
import { usePathname } from "next/navigation";

const deviceLabels: Record<DeviceType, string> = {
  computer: "Computer",
  monitor: "Monitor",
};

const toTitle = (path: string) =>
  path === "/"
    ? "Dashboard"
    : path.replace(/^\//, "").replace(/^\w/, (c) => c.toUpperCase());

interface PageHeaderProps {
  deviceType: DeviceType;
}

export const PageHeader = ({ deviceType }: PageHeaderProps) => {
  const pathname = usePathname();
  const title = toTitle(pathname);

  return (
    <header className="flex items-center justify-between mb-4 gap-2">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>

        <SearchControls pathname={pathname} />
      </div>

      <DeviceDialog
        mode="add"
        deviceType={deviceType}
        trigger={
          <Button className="inline-flex items-center gap-2">
            Add {deviceLabels[deviceType]}
          </Button>
        }
      />
    </header>
  );
};
