import { NewTicketsTable } from "@/components/Dashboard/NewTicketsTable";
import ProtectedLayout from "./(protected)/layout";
import { ResolvedTicketsSection } from "@/components/Dashboard/ResolvedTicketsSection";

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <div className="h-full grid grid-cols-2 gap-4">
        <div className="col-span-2 ">
          <NewTicketsTable />
        </div>

        <div>current tickets by day</div>
        <div>assigned to users</div>
        <div className="col-span-2">
          <ResolvedTicketsSection />
        </div>
      </div>
    </ProtectedLayout>
  );
}
