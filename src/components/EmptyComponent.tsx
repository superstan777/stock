"use client";

import {
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty";
import { LineChart } from "lucide-react";

export const EmptyComponent = () => {
  return (
    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LineChart className="h-10 w-10 text-muted-foreground" />
        </EmptyMedia>

        <EmptyTitle>No data to display</EmptyTitle>
        <EmptyDescription>
          Everything is working correctly, but there&apos;s no data to show
          right now. New entries will appear here once they&apos;re available.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
