"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createRelation } from "@/lib/api/relations";
import { DeviceCombobox } from "./DeviceCombobox";
import { UserCombobox } from "../DevicesPage/UserCombobox";
import { DatePicker } from "../ui/date-picker";

interface RelationFormProps {
  defaultUserId?: string;
  defaultDeviceId?: string;
}

export function RelationForm({
  defaultUserId,
  defaultDeviceId,
}: RelationFormProps) {
  const [userId, setUserId] = useState<string | null>(defaultUserId ?? null);
  const [deviceId, setDeviceId] = useState<string | null>(
    defaultDeviceId ?? null
  );
  const [startDate, setStartDate] = useState<Date | null>(null);

  const queryClient = useQueryClient();

  const createRelationMutation = useMutation({
    mutationFn: createRelation,
    onSuccess: () => {
      if (userId)
        queryClient.invalidateQueries({ queryKey: ["userRelations", userId] });
      if (deviceId)
        queryClient.invalidateQueries({
          queryKey: ["deviceRelations", deviceId],
        });

      // Reset form
      if (!defaultUserId) setUserId(null);
      if (!defaultDeviceId) setDeviceId(null);
      setStartDate(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !deviceId || !startDate) return;

    createRelationMutation.mutate({
      user_id: userId,
      device_id: deviceId,
      start_date: startDate.toISOString().split("T")[0],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 items-end border p-4 rounded-md mb-6"
    >
      {/* User combobox */}
      {!defaultUserId && (
        <div className="flex flex-col">
          <Label htmlFor="user">User</Label>
          <UserCombobox
            value={userId}
            onChange={setUserId}
            disabled={createRelationMutation.isPending}
          />
        </div>
      )}

      {/* Device combobox */}
      {!defaultDeviceId && (
        <div className="flex flex-col">
          <Label htmlFor="device">Device</Label>
          <DeviceCombobox
            value={deviceId}
            onChange={setDeviceId}
            disabled={createRelationMutation.isPending}
          />
        </div>
      )}

      {/* Date picker */}
      <div className="flex flex-col">
        <Label htmlFor="startDate">Start Date</Label>
        <DatePicker
          label="startDate"
          value={startDate}
          onChange={setStartDate}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={
          !userId || !deviceId || !startDate || createRelationMutation.isPending
        }
      >
        {createRelationMutation.isPending ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Assigning...
          </>
        ) : (
          "Assign"
        )}
      </Button>
    </form>
  );
}
