"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/types/supabase";
import { columns } from "./DevicesPage";
import { Skeleton } from "../ui/skeleton";
import { DeviceType } from "@/lib/types/devices";
import { DeviceDialog } from "./DeviceDialog";

type ComputerRow = Tables<"computers">;
type MonitorRow = Tables<"monitors">;
type DeviceRow = ComputerRow | MonitorRow;

type PageContentProps = {
  data: { data: DeviceRow[]; count: number } | undefined;
  isLoading: boolean;
  error: unknown;
  deviceType: DeviceType;
};

const EmptyState = ({ deviceType }: { deviceType: DeviceType }) => {
  const deviceName = deviceType === "computer" ? "computers" : "monitors";
  return (
    <div className="flex items-center justify-center h-full w-full text-gray-500">
      No {deviceName} found
    </div>
  );
};

const ErrorState = ({ error }: { error: unknown }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An unexpected error occurred";
  };

  return (
    <div className="flex items-center justify-center h-full w-full p-8">
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load data</AlertTitle>
          <AlertDescription className="mt-2">
            {getErrorMessage(error)}
          </AlertDescription>
        </Alert>

        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export const PageContent = ({
  data,
  isLoading,
  error,
  deviceType,
}: PageContentProps) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  console.log(data);

  const handleSerialClick = (device: DeviceRow) => {
    setSelectedDevice(device);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDevice(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full space-y-4">
        <div className="flex-1 space-y-3">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              {columns.map((col) => (
                <Skeleton key={col.value} className="h-8 w-32 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <ErrorState error={error} />;
  if (!data || data.data.length === 0)
    return <EmptyState deviceType={deviceType} />;

  return (
    <>
      <div className="flex-1 overflow-auto mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.value}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.data.map((row: DeviceRow) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.value}>
                    {col.value === "serial_number" ? (
                      <Button
                        variant="link"
                        onClick={() => handleSerialClick(row)}
                      >
                        {row[col.value as keyof DeviceRow]}
                      </Button>
                    ) : (
                      row[col.value as keyof DeviceRow]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedDevice && (
        <DeviceDialog
          mode="edit"
          deviceType={deviceType}
          device={selectedDevice}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
};
