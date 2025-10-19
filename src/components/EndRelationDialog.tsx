"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endRelation } from "@/lib/api/relations";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface EndRelationDialogProps {
  relationId: string;
  userId?: string;
  deviceId?: string;
}

export function EndRelationDialog({
  relationId,
  userId,
  deviceId,
}: EndRelationDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => endRelation(relationId),
    onSuccess: () => {
      if (userId)
        queryClient.invalidateQueries({ queryKey: ["userRelations", userId] });
      if (deviceId)
        queryClient.invalidateQueries({
          queryKey: ["deviceRelations", deviceId],
        });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">End</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>End Relation</DialogTitle>
          <DialogDescription>
            The relation will be ended with the current date. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Ending...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
