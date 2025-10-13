"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartBarDefaultProps {
  data: Record<string, any>[];
  chartConfig: ChartConfig;
  dataKey?: string; // np. "date" lub "operator"
  tickFormatter?: (value: any) => string;
  tooltipLabelFormatter?: (value: any) => string;
}

export function ChartBarDefault({
  data,
  chartConfig,
  dataKey = "date",
  tickFormatter,
  tooltipLabelFormatter,
}: ChartBarDefaultProps) {
  const firstKey = Object.keys(chartConfig)[0];

  const defaultTickFormatter = (value: any) => {
    if (dataKey === "date") {
      if (value === "No ETA") return "No ETA";
      const date = new Date(value);
      return isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return String(value);
  };

  const defaultTooltipLabelFormatter = (value: any) => {
    if (dataKey === "date") {
      if (value === "No ETA") return "No ETA";
      const date = new Date(value);
      return isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
    }
    return String(value);
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dataKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={tickFormatter || defaultTickFormatter}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              labelFormatter={
                tooltipLabelFormatter || defaultTooltipLabelFormatter
              }
            />
          }
        />
        <Bar dataKey={firstKey} fill={`var(--color-${firstKey})`} radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
