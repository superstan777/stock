import { NewTicketsTable } from "@/components/Dashboard/NewTicketsTable";
import ProtectedLayout from "./(protected)/layout";
import { ResolvedTicketsSection } from "@/components/Dashboard/ResolvedTicketsSection";

import { ChartBarMultiple } from "@/components/ui/chart-bar-multiple";
import { TicketsByDayChart } from "@/components/Dashboard/TicketsByDayChart";

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <div className="h-full grid grid-cols-2 gap-4">
        <div className="col-span-2 ">
          <NewTicketsTable />
        </div>
        {/* tickety wg dni */}
        <TicketsByDayChart />
        {/* tickety wg userow */}
        <ChartBarMultiple />

        <div className="col-span-2">
          <ResolvedTicketsSection />
        </div>
      </div>
    </ProtectedLayout>
  );
}
