import { render, screen } from "@testing-library/react";
import { PageHeader } from "./PageHeader";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("./SearchControls", () => ({
  SearchControls: ({ pathname }: { pathname: string }) => (
    <div data-testid="search-controls">SearchControls - {pathname}</div>
  ),
}));

jest.mock("./DeviceDialog", () => ({
  DeviceDialog: ({ trigger }: { trigger: React.ReactNode }) => (
    <div data-testid="device-dialog">{trigger}</div>
  ),
}));

describe("PageHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Dashboard title when pathname is root", () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    render(<PageHeader deviceType="computer" />);
    expect(
      screen.getByRole("heading", { name: "Dashboard" })
    ).toBeInTheDocument();
  });

  it("renders capitalized pathname as title", () => {
    (usePathname as jest.Mock).mockReturnValue("/computers");
    render(<PageHeader deviceType="computer" />);
    expect(
      screen.getByRole("heading", { name: "Computers" })
    ).toBeInTheDocument();
  });

  it("renders SearchControls with current pathname", () => {
    (usePathname as jest.Mock).mockReturnValue("/monitors");
    render(<PageHeader deviceType="monitor" />);
    expect(screen.getByTestId("search-controls")).toHaveTextContent(
      "/monitors"
    );
  });

  it("renders Add Computer button for deviceType=computer", () => {
    (usePathname as jest.Mock).mockReturnValue("/computers");
    render(<PageHeader deviceType="computer" />);
    expect(
      screen.getByRole("button", { name: /Add Computer/i })
    ).toBeInTheDocument();
  });

  it("renders Add Monitor button for deviceType=monitor", () => {
    (usePathname as jest.Mock).mockReturnValue("/monitors");
    render(<PageHeader deviceType="monitor" />);
    expect(
      screen.getByRole("button", { name: /Add Monitor/i })
    ).toBeInTheDocument();
  });

  it("wraps button in DeviceDialog", () => {
    (usePathname as jest.Mock).mockReturnValue("/computers");
    render(<PageHeader deviceType="computer" />);
    const dialog = screen.getByTestId("device-dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Add Computer");
  });
});
