import { render, screen, fireEvent } from "@testing-library/react";
import { PageContent } from "./PageContent";
import { Tables } from "@/lib/types/supabase";

jest.mock("../ui/skeleton", () => ({
  Skeleton: (props: Record<string, unknown>) => (
    <div data-testid="skeleton" {...props} />
  ),
}));

type DeviceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  device?: { serial_number?: string };
  mode: "edit" | "add";
};

jest.mock("./DeviceDialog", () => ({
  DeviceDialog: ({
    open,
    onOpenChange,
    onClose,
    device,
    mode,
  }: DeviceDialogProps) =>
    open ? (
      <div
        role="dialog"
        aria-label={mode === "edit" ? "Edit Device" : "Add Device"}
      >
        <div>Mock DeviceDialog</div>
        <div data-testid="device-serial">{device?.serial_number ?? ""}</div>

        <button
          onClick={() => {
            onClose?.();
            onOpenChange?.(false);
          }}
        >
          Save
        </button>

        <button
          onClick={() => {
            onOpenChange?.(false);
          }}
        >
          Cancel
        </button>
      </div>
    ) : null,
}));

function createMockComputer(
  overrides: Partial<Tables<"computers">> = {}
): Tables<"computers"> {
  return {
    id: "1",
    created_at: "2025-01-01T00:00:00Z",
    serial_number: "ABC123",
    model: "Lenovo",
    install_status: "Deployed",
    order_id: "order-1",
    ...overrides,
  };
}

describe("PageContent", () => {
  it("renders loading skeletons when isLoading=true", () => {
    render(
      <PageContent
        data={undefined}
        isLoading={true}
        error={null}
        deviceType="computer"
      />
    );

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders empty state when no data", () => {
    render(
      <PageContent
        data={{ data: [], count: 0 }}
        isLoading={false}
        error={null}
        deviceType="computer"
      />
    );

    expect(screen.getByText(/No computers found/i)).toBeInTheDocument();
  });

  it("renders error state when error provided", () => {
    render(
      <PageContent
        data={undefined}
        isLoading={false}
        error={new Error("Something went wrong")}
        deviceType="computer"
      />
    );

    expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("renders table with data", () => {
    const mockComputer = createMockComputer();

    render(
      <PageContent
        data={{ data: [mockComputer], count: 1 }}
        isLoading={false}
        error={null}
        deviceType="computer"
      />
    );

    expect(screen.getByText("Lenovo")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

  it("opens dialog when serial number clicked and closes it when Save clicked", () => {
    const mockComputer = createMockComputer();

    render(
      <PageContent
        data={{ data: [mockComputer], count: 1 }}
        isLoading={false}
        error={null}
        deviceType="computer"
      />
    );

    const serialButton = screen.getByText("ABC123");
    fireEvent.click(serialButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("device-serial")).toHaveTextContent("ABC123");

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
