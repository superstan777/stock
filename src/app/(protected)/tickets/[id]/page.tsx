import { getTicket } from "@/lib/api/tickets";
import { TicketPageContent } from "@/components/TicketPage/TicketPageContent";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return <div>No ticket id provided.</div>;

  const ticket = await getTicket(id);

  if (!ticket) return <div>Ticket not found.</div>;

  return <TicketPageContent ticket={ticket} />;
}
