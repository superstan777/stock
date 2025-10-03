"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserDevicesList } from "./UserDevicesList";
import { UserTicketsList } from "./UserTicketsList";
import { getUserDevices } from "@/lib/api/devices";
import { getUserTickets } from "@/lib/api/tickets";

interface UserTabsProps {
  userId: string;
}

export function UserTabs({ userId }: UserTabsProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const prefetch = async () => {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["userDevices", userId, "computer"],
          queryFn: () => getUserDevices("computer", userId),
        }),
        queryClient.prefetchQuery({
          queryKey: ["userDevices", userId, "monitor"],
          queryFn: () => getUserDevices("monitor", userId),
        }),
        queryClient.prefetchQuery({
          queryKey: ["userTickets", userId],
          queryFn: () => getUserTickets(userId),
        }),
      ]);
    };

    prefetch();
  }, [userId, queryClient]);
  const triggerClass =
    "px-4 py-2 rounded-t-md border-b-2 border-transparent " +
    "data-[state=active]:border-b-gray-200 data-[state=active]:-mb-px " +
    "data-[state=active]:text-gray-900";

  return (
    <div className="mt-6 w-full">
      <Tabs defaultValue="computers" className="w-full">
        <div className="flex justify-center border-b border-gray-200">
          <TabsList className="inline-flex mb-0 space-x-4">
            <TabsTrigger value="computers" className={triggerClass}>
              Computers
            </TabsTrigger>
            <TabsTrigger value="monitors" className={triggerClass}>
              Monitors
            </TabsTrigger>
            <TabsTrigger value="tickets" className={triggerClass}>
              Tickets
            </TabsTrigger>
          </TabsList>
        </div>

        <div>
          <TabsContent value="computers">
            <UserDevicesList userId={userId} deviceType="computer" />
          </TabsContent>

          <TabsContent value="monitors">
            <UserDevicesList userId={userId} deviceType="monitor" />
          </TabsContent>

          <TabsContent value="tickets">
            <UserTicketsList userId={userId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
