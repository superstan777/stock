"use client";

import { useState, useEffect } from "react";
import { DeviceForm } from "./DeviceForm";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import type { DeviceRow } from "@/lib/types/devices";
import type { RelationWithDetails } from "@/lib/types/relations";

export function DevicePageContent({
  device,
  relations,
}: {
  device: DeviceRow;
  relations: RelationWithDetails[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  console.log(device, "device");

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end">
        <Button type="submit" form="device-form" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
              Please wait
            </>
          ) : (
            "Update"
          )}
        </Button>
      </div>

      <DeviceForm device={device} setIsLoading={setIsLoading} />
      {/* data table */}

      {/* Tymczasowo tylko log */}
      <pre className="text-xs bg-gray-50 p-4 rounded-md">
        {JSON.stringify(relations, null, 2)}
      </pre>
    </div>
  );
}
