"use client";

import React from "react";
import { DataTable } from "../ListPage/DataTable";
import { DEVICE_PAGE_RELATION_COLUMNS } from "@/lib/consts/relations";
import { RelationForm } from "../UsersPage/RelationForm";
import type { RelationWithDetails } from "@/lib/types/relations";

interface DeviceHistoryProps {
  relations: RelationWithDetails[];
  isLoading: boolean;
  error?: unknown;
  deviceId: string; // potrzebne do przekazania domyślnego device_id
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

      {/* Form do tworzenia nowej relacji */}
      <RelationForm defaultDeviceId={deviceId} />

      {/* Tabela historii */}
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
