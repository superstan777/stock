"use client";

import { DataTable } from "../ListPage/DataTable";
import { USER_PAGE_COMPUTERS_COLUMNS } from "@/lib/consts/computers";
import { USER_MONITORS_COLUMNS } from "@/lib/consts/monitors";
import type { DeviceType } from "@/lib/types/devices";
import type { RelationWithDetails } from "@/lib/types/relations";

interface UserDevicesListProps {
  userId: string;
  deviceType: DeviceType;
  relations: RelationWithDetails[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export const UserDevicesList = ({
  deviceType,
  relations,
  isLoading,
  isError,
  error,
}: UserDevicesListProps) => {
  if (isLoading) {
    return (
      <div className="mt-8 w-full text-center">Loading {deviceType}s...</div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 text-red-500 text-center">
        Error loading {deviceType}s.
      </div>
    );
  }

  const filteredDevices = relations
    .filter((r) => r.device.device_type === deviceType)
    .map((r) => r.device);

  return (
    <div className="mt-8">
      <DataTable
        data={filteredDevices}
        columns={
          deviceType === "computer"
            ? USER_PAGE_COMPUTERS_COLUMNS
            : USER_MONITORS_COLUMNS
        }
        isLoading={isLoading}
        error={error}
        entity={deviceType}
      />
    </div>
  );
};
