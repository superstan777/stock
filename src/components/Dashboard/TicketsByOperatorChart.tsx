"use client";

import { useQuery } from "@tanstack/react-query";
import { getTicketsByOperator } from "@/lib/api/tickets";
import { ChartBarDefault } from "../ui/chart-bar-default";
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

export const TicketsByOperatorChart = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard", "tickets-by-operator"],
    queryFn: getTicketsByOperator,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading)
    return (
      <Card className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin text-muted-foreground" />
      </Card>
    );

  if (isError) return <ErrorComponent />;
  if (data.length === 0) return <EmptyComponent />;

  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  console.log(data);

  return (
    <Card>
      <CardHeader className="flex flex-col pb-6 border-b">
        <CardTitle>Open Tickets by Operator</CardTitle>
        <CardDescription>
          All open tickets grouped by operator —{" "}
          <span className="font-semibold text-foreground">{total}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartBarDefault
          data={data.map((d) => ({
            operator: d.operator.name,
            count: d.count,
          }))}
          chartConfig={{
            count: { label: "Tickets", color: "var(--chart-1)" },
          }}
          dataKey="operator"
        />
      </CardContent>
    </Card>
  );
};
