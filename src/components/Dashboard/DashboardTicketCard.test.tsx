import { render, screen } from "@testing-library/react";
import { DashboardTicketCard } from "./DashboardTicketCard";

describe("DashboardTicketCard", () => {
  it("renders correctly for 'resolved' type", () => {
    render(<DashboardTicketCard type="resolved" value={12} />);

    expect(screen.getByText("Resolved Tickets")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Resolved This Week")).toBeInTheDocument();
  });

  it("renders correctly for 'inProgress' type", () => {
    render(<DashboardTicketCard type="inProgress" value={7} />);

    expect(screen.getByText("Current Queue")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("In Queue")).toBeInTheDocument();
  });

  it("renders zero value correctly", () => {
    render(<DashboardTicketCard type="resolved" value={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders large values correctly", () => {
    render(<DashboardTicketCard type="inProgress" value={9999} />);

    expect(screen.getByText("9999")).toBeInTheDocument();
  });
});
