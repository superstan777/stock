"use client";

import {
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";

export const EntityNotFound = () => {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const entity = segments[0] ?? "item";

  const singular =
    entity.endsWith("s") && entity.length > 1 ? entity.slice(0, -1) : entity;

  const goBack = () => {
    const basePath = `/${entity}`;
    router.push(basePath);
  };

  return (
    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </EmptyMedia>

        <EmptyTitle>
          {singular.charAt(0).toUpperCase() + singular.slice(1)} not found
        </EmptyTitle>
        <EmptyDescription>
          The {singular.toLowerCase()} you're trying to access does not exist or
          provided ID is invalid.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button variant="outline" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
          Go back
        </Button>
      </EmptyContent>
    </Empty>
  );
};
