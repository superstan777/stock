"use client";

import { useQuery } from "@tanstack/react-query";
import { getResolvedTicketsStats } from "@/lib/api/tickets";
import { ChartBarInteractive } from "../ui/chart-bar-interactive";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorComponent } from "../ErrorComponent";
import { EmptyComponent } from "../EmptyComponent";

export const ResolvedTicketsSection = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["resolved-tickets-stats"],
    queryFn: getResolvedTicketsStats,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (isError) {
    return <ErrorComponent />;
  }

  if (data.length === 0) {
    return <EmptyComponent />;
  }

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card>
      <CardHeader className="flex flex-col p-6 border-b">
        <CardTitle>Resolved Tickets</CardTitle>
        <CardDescription>
          Tickets resolved in the past 3 months — {total}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartBarInteractive data={data} />
      </CardContent>
    </Card>
  );
};
