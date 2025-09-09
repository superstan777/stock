import { render, screen } from "@testing-library/react";
import { DashboardStatCard } from "./DashboardStatCard";

describe("DashboardStatCard", () => {
  it("renders with default placeholder data when no data is passed", () => {
    render(<DashboardStatCard statType="computers" />);

    expect(screen.getByText("Computers")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Deployed: 0 • Inventory: 0")).toBeInTheDocument();
    expect(screen.getByText("0 returned this month")).toBeInTheDocument();
    expect(screen.getByText("↓ 0")).toBeInTheDocument();
  });

  it("renders with provided data", () => {
    render(
      <DashboardStatCard
        statType="monitors"
        data={{
          total: 10,
          deployed: 6,
          inventory: 4,
          returned: { thisMonth: 2, lastMonth: 3 },
        }}
      />
    );

    expect(screen.getByText("Monitors")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Deployed: 6 • Inventory: 4")).toBeInTheDocument();
    expect(screen.getByText("2 returned this month")).toBeInTheDocument();
    expect(screen.getByText("↓ 1")).toHaveClass("text-red-600");
  });

  it("shows upward trend when thisMonth > lastMonth", () => {
    render(
      <DashboardStatCard
        statType="computers"
        data={{
          total: 5,
          deployed: 3,
          inventory: 2,
          returned: { thisMonth: 4, lastMonth: 2 },
        }}
      />
    );

    expect(screen.getByText("4 returned this month")).toBeInTheDocument();
    expect(screen.getByText("↑ 2")).toHaveClass("text-green-600");
  });

  it("shows downward trend when thisMonth < lastMonth", () => {
    render(
      <DashboardStatCard
        statType="computers"
        data={{
          total: 5,
          deployed: 3,
          inventory: 2,
          returned: { thisMonth: 1, lastMonth: 3 },
        }}
      />
    );

    expect(screen.getByText("1 returned this month")).toBeInTheDocument();
    expect(screen.getByText("↓ 2")).toHaveClass("text-red-600");
  });

  it("handles equal thisMonth and lastMonth correctly", () => {
    render(
      <DashboardStatCard
        statType="monitors"
        data={{
          total: 7,
          deployed: 4,
          inventory: 3,
          returned: { thisMonth: 2, lastMonth: 2 },
        }}
      />
    );

    expect(screen.getByText("2 returned this month")).toBeInTheDocument();
    expect(screen.getByText("↓ 0")).toHaveClass("text-red-600");
  });
});
