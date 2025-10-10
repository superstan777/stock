import { getTicket } from "@/lib/api/tickets";
import { TicketPageContent } from "@/components/TicketPage/TicketPageContent";
import { EntityNotFound } from "@/components/EntityNotFound";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const ticket = await getTicket(id);

    if (ticket) {
      return <TicketPageContent ticket={ticket} />;
    }
  } catch (error) {
    return <EntityNotFound />;
  }
}
