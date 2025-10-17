"use client";

import { DataTable } from "../ListPage/DataTable";
import { USER_PAGE_RELATION_COLUMNS } from "@/lib/consts/relations";
import type { RelationWithDetails } from "@/lib/types/relations";

interface UserDevicesListProps {
  userId: string;
  relations: RelationWithDetails[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export const UserDevicesList = ({
  relations,
  isLoading,
  isError,
  error,
}: UserDevicesListProps) => {
  if (isLoading) {
    return <div className="mt-8 w-full text-center">Loading devices...</div>;
  }

  if (isError) {
    return (
      <div className="mt-8 text-red-500 text-center">
        Error loading devices.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <DataTable
        data={relations}
        columns={USER_PAGE_RELATION_COLUMNS}
        isLoading={isLoading}
        error={error}
        entity="relation"
      />
    </div>
  );
};
