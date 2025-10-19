"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { endRelation } from "@/lib/api/relations";

interface EndRelationButtonProps {
  relationId: string;
  userId?: string;
  deviceId?: string;
}

export function EndRelationButton({
  relationId,
  userId,
  deviceId,
}: EndRelationButtonProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => endRelation(relationId),
    onSuccess: () => {
      if (userId)
        queryClient.invalidateQueries({ queryKey: ["userRelations", userId] });
      if (deviceId)
        queryClient.invalidateQueries({
          queryKey: ["deviceRelations", deviceId],
        });
    },
  });

  return (
    <Button
      size="sm"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? (
        <Loader2 className="animate-spin  h-4 w-4" />
      ) : (
        "End"
      )}
    </Button>
  );
}
