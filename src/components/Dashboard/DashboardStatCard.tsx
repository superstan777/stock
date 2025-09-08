type StatType = "computers" | "monitors";

interface DashboardStatCardProps {
  statType: StatType;
  data?: {
    total: number;
    deployed?: number;
    inventory?: number;
    returned?: {
      thisMonth: number;
      lastMonth: number;
    };
  };
}

export const DashboardStatCard = ({
  statType,
  data,
}: DashboardStatCardProps) => {
  // Default placeholder if no data is passed
  const placeholderData = {
    total: 0,
    deployed: 0,
    inventory: 0,
    returned: { thisMonth: 0, lastMonth: 0 },
  };

  const statData = data ?? placeholderData;

  // Map the title depending on statType
  const titles: Record<StatType, string> = {
    computers: "Computers",
    monitors: "Monitors",
  };

  return (
    <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border h-full flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold">{titles[statType]}</h2>
        <p className="text-5xl font-extrabold mt-2">{statData.total}</p>

        {/* Breakdown for devices */}
        <p className="text-base text-muted-foreground mt-1">
          Deployed: {statData.deployed} • Inventory: {statData.inventory}
        </p>
      </div>

      {/* Trend / Change */}
      <div className="flex items-center gap-2 text-base mt-4">
        {statData.returned && (
          <>
            <span className="font-medium">
              {statData.returned.thisMonth} returned this month
            </span>
            {statData.returned.thisMonth > statData.returned.lastMonth ? (
              <span className="text-green-600">
                ↑ {statData.returned.thisMonth - statData.returned.lastMonth}
              </span>
            ) : (
              <span className="text-red-600">
                ↓ {statData.returned.lastMonth - statData.returned.thisMonth}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
