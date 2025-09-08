import ProtectedLayout from "./(protected)/layout";
import { DashboardStatCard } from "@/components/Dashboard/DashboardStatCard";
import { DashboardTicketItem } from "@/components/Dashboard/DashboardTicketCard";

const mockStats = {
  computers: {
    total: 120,
    deployed: 80,
    inventory: 40,
    returnedThisMonth: 10,
    returnedLastMonth: 8,
  },
  monitors: {
    total: 75,
    deployed: 50,
    inventory: 25,
    returnedThisMonth: 5,
    returnedLastMonth: 6,
  },
};

const mockTickets = {
  currentQueue: 12,
  resolvedThisWeek: 40,
};

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <div className="h-full grid grid-cols-2 gap-4">
        <DashboardStatCard statType="computers" data={mockStats.computers} />
        <DashboardStatCard statType="monitors" data={mockStats.monitors} />
        <DashboardTicketItem
          type="inProgress"
          value={mockTickets.currentQueue}
        />
        <DashboardTicketItem
          type="resolved"
          value={mockTickets.resolvedThisWeek}
        />
      </div>
    </ProtectedLayout>
  );
}
