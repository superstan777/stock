import { NewTicketsTable } from "@/components/Dashboard/NewTicketsTable";
import ProtectedLayout from "./(protected)/layout";
import { ResolvedTicketsSection } from "@/components/Dashboard/ResolvedTicketsSection";

import { ChartBarMultiple } from "@/components/ui/chart-bar-multiple";
import { TicketsByDayChart } from "@/components/Dashboard/TicketsByDayChart";
import { TicketsByOperatorChart } from "@/components/Dashboard/TicketsByOperatorChart";

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <div className="h-full grid grid-cols-2 gap-4">
        <div className="col-span-2 ">
          <NewTicketsTable />
        </div>
        <TicketsByDayChart />
        <TicketsByOperatorChart />
        <div className="col-span-2">
          <ResolvedTicketsSection />
        </div>
      </div>
    </ProtectedLayout>
  );
}
