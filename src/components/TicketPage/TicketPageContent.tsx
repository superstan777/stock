"use client";

import { useState } from "react";
import { TicketForm } from "./TicketForm";
import { WorknotesSection } from "./WorknotesSection";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateTicket } from "@/lib/api/tickets";
import { addWorknote } from "@/lib/api/worknotes";
import { getUsers } from "@/lib/api/users";
import type { TicketUpdate, TicketWithUsers } from "@/lib/types/tickets";
import type { UserRow } from "@/lib/types/users";

export function TicketPageContent({ ticket }: { ticket: TicketWithUsers }) {
  const [isLoading, setIsLoading] = useState(false);
  const [worknote, setWorknote] = useState("");
  const queryClient = useQueryClient();
  // temporary solution, will be changed after migration to own backend
  const currentUserId = "138ce128-e78d-4998-890b-d064663564ec";

  const { data: users = [], isLoading: isUsersLoading } = useQuery<UserRow[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsers();
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: TicketUpdate) => {
      if (!worknote.trim()) {
        throw new Error("Worknote is required when updating a ticket");
      }

      const assignedUserId = formData.assigned_to
        ? users.find((u) => u.email === formData.assigned_to)?.id ?? null
        : null;

      await updateTicket(ticket.id, {
        ...formData,
        assigned_to: assignedUserId,
      });

      await addWorknote({
        ticket_id: ticket.id,
        note: worknote.trim(),
        author_id: currentUserId,
      });
    },
    onMutate: () => setIsLoading(true),
    onSettled: () => setIsLoading(false),
    onSuccess: () => {
      toast.success("Ticket updated and worknote added");
      setWorknote("");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["worknotes", ticket.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update ticket");
    },
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end">
        <Button
          type="submit"
          form="ticket-form"
          disabled={isLoading || isUsersLoading}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
              Please wait
            </>
          ) : (
            "Update"
          )}
        </Button>
      </div>

      <TicketForm
        ticket={ticket}
        setIsLoading={setIsLoading}
        onSubmit={(formData) => {
          mutation.mutate(formData);
        }}
      />

      <WorknotesSection
        ticketId={ticket.id}
        note={worknote}
        onNoteChange={setWorknote}
      />
    </div>
  );
}
