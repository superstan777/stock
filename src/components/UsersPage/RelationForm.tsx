"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createRelation } from "@/lib/api/relations";
import { DeviceCombobox } from "./DeviceCombobox";
import { DatePicker } from "../ui/date-picker";

interface RelationFormProps {
  defaultUserId: string;
}

export function RelationForm({ defaultUserId }: RelationFormProps) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const queryClient = useQueryClient();

  const createRelationMutation = useMutation({
    mutationFn: createRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userRelations", defaultUserId],
      });
      setDeviceId(null);
      setStartDate(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId || !startDate) return;

    createRelationMutation.mutate({
      user_id: defaultUserId,
      device_id: deviceId,
      start_date: startDate.toISOString().split("T")[0], // konwersja na string w formacie YYYY-MM-DD
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 items-end border p-4 rounded-md mb-6"
    >
      {/* Wybór urządzenia */}
      <div className="flex flex-col">
        <Label htmlFor="device">Device</Label>
        <DeviceCombobox
          value={deviceId}
          onChange={setDeviceId}
          disabled={createRelationMutation.isPending}
        />
      </div>

      {/* Wybór daty rozpoczęcia */}
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
        disabled={!deviceId || !startDate || createRelationMutation.isPending}
      >
        {createRelationMutation.isPending ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Assigning...
          </>
        ) : (
          "Assign device"
        )}
      </Button>
    </form>
  );
}
