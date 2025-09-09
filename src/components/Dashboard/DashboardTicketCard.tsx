interface DashboardTicketItemProps {
  type: "resolved" | "inProgress";
  value: number;
}

export const DashboardTicketCard = ({
  type,
  value,
}: DashboardTicketItemProps) => {
  const config = {
    resolved: {
      title: "Resolved Tickets",
      subtitle: "Resolved This Week",
    },
    inProgress: {
      title: "Current Queue",
      subtitle: "In Queue",
    },
  };

  const { title, subtitle } = config[type];

  return (
    <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border h-full flex flex-col">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-5xl font-extrabold mt-2">{value}</p>
      <p className="text-base text-muted-foreground mt-1">{subtitle}</p>

      {/* Optional: could add trend / change indicator here if needed */}
      <div className="flex items-center justify-center gap-2 text-base mt-4"></div>
    </div>
  );
};
