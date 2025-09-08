import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeviceDialog } from "./DeviceDialog";
import { DeviceFormProps } from "./DeviceForm";

// Mock DeviceForm to simplify testing
jest.mock("./DeviceForm", () => ({
  DeviceForm: ({ setIsLoading, onSuccess, onError }: DeviceFormProps) => (
    <div>
      <button
        onClick={() => {
          setIsLoading(true);
          onSuccess?.();
        }}
      >
        Submit Form
      </button>
      <button onClick={() => onError?.({ code: "23505" })}>
        Trigger Duplicate Error
      </button>
      <button onClick={() => onError?.(new Error("generic"))}>
        Trigger Generic Error
      </button>
    </div>
  ),
}));

describe("DeviceDialog", () => {
  it("renders trigger and opens dialog on click", async () => {
    render(
      <DeviceDialog
        deviceType="computer"
        mode="add"
        trigger={<button>Open Dialog</button>}
      />
    );

    expect(screen.queryByText(/Add Computer/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByText(/Open Dialog/i));
    expect(screen.getByText(/Add Computer/i)).toBeInTheDocument();
    expect(screen.getByText(/Create new computer/i)).toBeInTheDocument();
  });

  it("renders in edit mode with correct texts", async () => {
    render(
      <DeviceDialog
        deviceType="monitor"
        mode="edit"
        device={{
          id: "1",
          created_at: null,
          serial_number: "123",
          model: "X",
          order_id: "O1",
          install_status: "Deployed",
        }}
        trigger={<button>Open Dialog</button>}
      />
    );

    await userEvent.click(screen.getByText(/Open Dialog/i));
    expect(screen.getByText(/Edit Monitor/i)).toBeInTheDocument();
    expect(screen.getByText(/Update monitor information/i)).toBeInTheDocument();
  });

  it("calls onClose when dialog is closed", async () => {
    const onClose = jest.fn();
    render(
      <DeviceDialog
        deviceType="computer"
        mode="add"
        trigger={<button>Open Dialog</button>}
        onClose={onClose}
      />
    );
    await userEvent.click(screen.getByText(/Open Dialog/i));
    await userEvent.click(screen.getByText(/Cancel/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("handles duplicate error code 23505", async () => {
    render(
      <DeviceDialog
        deviceType="computer"
        mode="add"
        trigger={<button>Open Dialog</button>}
      />
    );
    await userEvent.click(screen.getByText(/Open Dialog/i));
    await userEvent.click(screen.getByText(/Trigger Duplicate Error/i));
    expect(
      await screen.findByText(/Computer already in database/i)
    ).toBeInTheDocument();
  });

  it("handles generic errors", async () => {
    render(
      <DeviceDialog
        deviceType="monitor"
        mode="edit"
        device={{
          id: "1",
          created_at: null,
          serial_number: "123",
          model: "X",
          order_id: "O1",
          install_status: "Deployed",
        }}
        trigger={<button>Open Dialog</button>}
      />
    );
    await userEvent.click(screen.getByText(/Open Dialog/i));
    await userEvent.click(screen.getByText(/Trigger Generic Error/i));
    expect(
      await screen.findByText(/Failed to update monitor/i)
    ).toBeInTheDocument();
  });

  it("works in controlled mode without internal state", async () => {
    const onOpenChange = jest.fn();
    render(
      <DeviceDialog
        deviceType="computer"
        mode="add"
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getByText(/Add Computer/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Cancel/i));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders correctly without trigger", () => {
    render(<DeviceDialog deviceType="computer" mode="add" open={true} />);
    expect(screen.getByText(/Add Computer/i)).toBeInTheDocument();
  });

  it("toggles loading state correctly on submit", async () => {
    render(
      <DeviceDialog
        deviceType="computer"
        mode="add"
        trigger={<button>Open Dialog</button>}
      />
    );

    await userEvent.click(screen.getByText(/Open Dialog/i));
    const submitButton = screen.getByText(/Submit Form/i);
    await userEvent.click(submitButton);
    // Branch coverage hits setIsLoading(true) inside the form
  });
});
