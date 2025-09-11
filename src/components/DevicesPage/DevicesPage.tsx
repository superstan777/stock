"use client";

import { PageFooter } from "@/components/DevicesPage/PageFooter";
import { PageHeader } from "@/components/DevicesPage/PageHeader";
import { PageContent } from "@/components/DevicesPage/PageContent";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getDevices } from "@/lib/fetchers/devices";

import { DevicesColumnType, DeviceType } from "@/lib/types/devices";

export const columns: DevicesColumnType[] = [
  { label: "Serial Number", value: "serial_number" },
  { label: "Model", value: "model" },
  { label: "Order ID", value: "order_id" },
  { label: "Install Status", value: "install_status" },
  { label: "Assigned User", value: "user_id" },
];

interface DevicesPageProps {
  deviceType: DeviceType;
}

export default function DevicesPage({ deviceType }: DevicesPageProps) {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const filter = searchParams.get("filter") as
    | "serial_number"
    | "model"
    | "order_id"
    | "install_status"
    | undefined;
  const query = searchParams.get("query") || undefined;

  const queryKey = deviceType === "computer" ? "computers" : "monitors";

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, currentPage, filter, query],
    queryFn: () =>
      getDevices(deviceType, {
        filter,
        query,
        page: currentPage,
        perPage: 20,
      }),
  });

  const totalPages = Math.ceil((data?.count ?? 0) / 20);

  return (
    <div className="flex flex-col h-full">
      <PageHeader deviceType={deviceType} />
      <PageContent
        data={data}
        isLoading={isLoading}
        error={error}
        deviceType={deviceType}
      />
      <PageFooter currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
