"use client";

import React from "react";
import { DataTable } from "../ListPage/DataTable";
import { DEVICE_PAGE_RELATION_COLUMNS } from "@/lib/consts/relations";
import { RelationForm } from "../UsersPage/RelationForm";
import type { RelationWithDetails } from "@/lib/types/relations";

interface DeviceHistoryProps {
  deviceId: string;
  relations: RelationWithDetails[];
  isLoading: boolean;
  error?: unknown;
}

export const DeviceHistory = ({
  relations,
  isLoading,
  error,
  deviceId,
}: DeviceHistoryProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Device History</h2>

      <RelationForm defaultDeviceId={deviceId} />

      <DataTable
        data={relations}
        isLoading={isLoading}
        error={error}
        columns={DEVICE_PAGE_RELATION_COLUMNS}
        entity="relation"
      />
    </div>
  );
};
