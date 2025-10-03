"use client";

import { useState } from "react";
import { DeviceForm } from "./DeviceForm";

import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import type { DeviceForTable, DeviceType } from "@/lib/types/devices";

export function DevicePageContent({
  device,
  deviceType,
}: {
  device: DeviceForTable;
  deviceType: DeviceType;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Button type="submit" form={`${deviceType}-form`} disabled={isLoading}>
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

      <DeviceForm
        device={device}
        setIsLoading={setIsLoading}
        deviceType={deviceType}
      />
    </div>
  );
}
