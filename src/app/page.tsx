import { NewTicketsTable } from "@/components/Dashboard/NewTicketsTable";
import ProtectedLayout from "./(protected)/layout";
import { ResolvedTicketsSection } from "@/components/Dashboard/ResolvedTicketsSection";
import { ChartBarDefault } from "@/components/ui/chart-bar-default";
import { ChartBarMultiple } from "@/components/ui/chart-bar-multiple";

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <div className="h-full grid grid-cols-2 gap-4">
        <div className="col-span-2 ">
          <NewTicketsTable />
        </div>
        <ChartBarDefault />

        <ChartBarMultiple />

        <div className="col-span-2">
          <ResolvedTicketsSection />
        </div>
      </div>
    </ProtectedLayout>
  );
}
