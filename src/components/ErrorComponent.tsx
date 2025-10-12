"use client";

import {
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty";
import { AlertCircle, RefreshCcwIcon } from "lucide-react";
import { Button } from "./ui/button";

export const ErrorComponent = () => {
  return (
    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </EmptyMedia>

        <EmptyTitle>Oops! Something went wrong</EmptyTitle>
        <EmptyDescription>
          We couldn&apos;t load the data right now. Please try again — it might
          just be a temporary issue.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button variant="outline" size="sm">
          <RefreshCcwIcon />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  );
};
