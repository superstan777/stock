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
}

export function ChartBarDefault({ data, chartConfig }: ChartBarDefaultProps) {
  const firstKey = Object.keys(chartConfig)[0];

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          minTickGap={32}
          tickFormatter={(value) => {
            if (value === "No ETA") return "No ETA";
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              labelFormatter={(value: string) =>
                value === "No ETA"
                  ? "No ETA"
                  : new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
              }
            />
          }
        />
        <Bar dataKey={firstKey} fill={`var(--color-${firstKey})`} radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
