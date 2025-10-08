"use client";

import { useState } from "react";
import { TicketForm } from "./TicketForm";

import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

import type { TicketWithUsers } from "@/lib/types/tickets";
import { WorknotesSection } from "./WorknotesSection";

export function TicketPageContent({ ticket }: { ticket: TicketWithUsers }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Button type="submit" form="ticket-form" disabled={isLoading}>
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

      <TicketForm ticket={ticket} setIsLoading={setIsLoading} />
      <WorknotesSection ticketId={ticket.id} />
    </div>
  );
}
