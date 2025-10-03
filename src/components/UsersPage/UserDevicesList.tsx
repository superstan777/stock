"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserDevices } from "@/lib/api/devices";
import type { DeviceForTable, DeviceType } from "@/lib/types/devices";
import { DataTable } from "../ListPage/DataTable";
import { USER_MONITORS_COLUMNS, USER_COMPUTERS_COLUMNS } from "@/lib/constants";

interface UserDevicesListProps {
  userId: string;
  deviceType: DeviceType;
}

export const UserDevicesList = ({
  userId,
  deviceType,
}: UserDevicesListProps) => {
  const { data, isLoading, isError, error } = useQuery<DeviceForTable[]>({
    queryKey: ["userDevices", userId, deviceType],
    queryFn: () => getUserDevices(deviceType, userId),
  });

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

  return (
    <div className="mt-8">
      <DataTable
        data={data}
        isLoading={isLoading}
        error={error}
        columns={
          deviceType === "computer"
            ? USER_COMPUTERS_COLUMNS
            : USER_MONITORS_COLUMNS
        }
        entity={deviceType}
      />
    </div>
  );
};
