// src/components/DevicesPage/DeviceForm.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeviceForm } from "./DeviceForm";
import { addDevice, updateDevice } from "@/lib/api/devices";

// --- Mocks ------------------------------------------------------------------

// 1) Mock the API layer (addDevice / updateDevice)
jest.mock("@/lib/api/devices", () => ({
  addDevice: jest.fn(),
  updateDevice: jest.fn(),
}));

// 2) Mock the supabase Constants so enum values exist at runtime
jest.mock("@/lib/types/supabase", () => ({
  Constants: {
    public: {
      Enums: {
        install_status: ["Deployed", "In inventory", "End of life", "Disposed"],
      },
    },
  },
}));

/**
 * 3) Mock shadcn/ui Select into a native <select> so:
 *  - we can reliably use getByLabelText("Install status")
 *  - the <Label htmlFor="install_status"> associates with the control
 *  - onValueChange is driven by <select onChange>
 *
 * The component renders:
 *   <Select>
 *     <SelectTrigger />
 *     <SelectContent>
 *       <SelectItem value="..." />
 *     </SelectContent>
 *   </Select>
 *
 * We flatten the structure so <Select> ultimately renders:
 *   <select id="install_status"> <option value="...">...</option>... </select>
 */
jest.mock("@/components/ui/select", () => {
  const React = require("react");
  const flatten = (children: any): any[] =>
    React.Children.toArray(children).flatMap((child: any) => {
      if (!child || !child.type) return child;
      // If it's our mocked wrappers, dive into their children
      if (child.type.displayName === "MockSelectTrigger") return [];
      if (child.type.displayName === "MockSelectContent")
        return flatten(child.props.children);
      if (child.type.displayName === "MockSelectItem")
        return React.cloneElement(child, child.props);
      return child;
    });

  const Select = ({
    value,
    onValueChange,
    children,
  }: {
    value?: string;
    onValueChange?: (v: string) => void;
    children?: React.ReactNode;
  }) => (
    <select
      id="install_status"
      data-testid="install-status"
      value={value ?? ""}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
    >
      {flatten(children)}
    </select>
  );

  const SelectTrigger = ({ children }: any) => <>{children}</>;
  SelectTrigger.displayName = "MockSelectTrigger";

  const SelectContent = ({ children }: any) => <>{children}</>;
  SelectContent.displayName = "MockSelectContent";

  const SelectItem = ({ value, children }: any) => (
    <option value={value}>{children}</option>
  );
  SelectItem.displayName = "MockSelectItem";

  const SelectValue = (_: any) => null;

  return { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
});

// ---------------------------------------------------------------------------

const renderWithClient = (
  ui: React.ReactElement,
  client?: QueryClient
): { queryClient: QueryClient } & ReturnType<typeof render> => {
  const queryClient = client ?? new QueryClient();
  const result = render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
  return { ...result, queryClient };
};

describe("DeviceForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- Rendering & Accessibility ----------

  it("renders all fields in add mode and sets default status", () => {
    const setIsLoading = jest.fn();
    const { container } = renderWithClient(
      <DeviceForm
        deviceType="computer"
        mode="add"
        setIsLoading={setIsLoading}
      />
    );

    // Inputs
    expect(screen.getByLabelText(/serial number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/order id/i)).toBeInTheDocument();

    // Select (mocked to native)
    const statusSelect = screen.getByLabelText(
      /install status/i
    ) as HTMLSelectElement;
    expect(statusSelect).toBeInTheDocument();
    // Default should be "In inventory"
    expect(statusSelect.value).toBe("In inventory");

    // Form id based on deviceType
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("id", "computer-form");
    // Role="form" present (for submission trigger by role)
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders edit mode with default values from device and serial is readOnly", () => {
    const setIsLoading = jest.fn();
    renderWithClient(
      <DeviceForm
        deviceType="computer"
        mode="edit"
        setIsLoading={setIsLoading}
        device={{
          id: "1",
          created_at: "2025-08-26T00:00:00Z",
          serial_number: "SN999",
          model: "MacBook Air",
          order_id: "ORD999",
          install_status: "Disposed",
        }}
      />
    );

    const serial = screen.getByLabelText(/serial number/i) as HTMLInputElement;
    const model = screen.getByLabelText(/model/i) as HTMLInputElement;
    const orderId = screen.getByLabelText(/order id/i) as HTMLInputElement;
    const status = screen.getByLabelText(
      /install status/i
    ) as HTMLSelectElement;

    expect(serial).toHaveValue("SN999");
    expect(serial).toHaveAttribute("readonly");
    expect(model).toHaveValue("MacBook Air");
    expect(orderId).toHaveValue("ORD999");
    expect(status.value).toBe("Disposed");
  });

  // ---------- Validation ----------

  it("shows validation errors when submitting empty form", async () => {
    const setIsLoading = jest.fn();
    renderWithClient(
      <DeviceForm
        deviceType="computer"
        mode="add"
        setIsLoading={setIsLoading}
      />
    );

    // Submit without filling
    fireEvent.submit(screen.getByRole("form"));

    // Expect zodResolver error messages
    expect(
      await screen.findByText(/serial number is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/model is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/order id is required/i)
    ).toBeInTheDocument();
  });

  // ---------- Add mode (success & error) ----------

  it("calls addDevice, toggles loading, invalidates 'computers', and calls onSuccess in add mode", async () => {
    (addDevice as jest.Mock).mockResolvedValueOnce({ id: "abc" });
    const setIsLoading = jest.fn();
    const onSuccess = jest.fn();

    const queryClient = new QueryClient();
    const spyInvalidate = jest.spyOn(queryClient, "invalidateQueries");

    renderWithClient(
      <DeviceForm
        deviceType="computer"
        mode="add"
        setIsLoading={setIsLoading}
        onSuccess={onSuccess}
      />,
      queryClient
    );

    fireEvent.change(screen.getByLabelText(/serial number/i), {
      target: { value: "SN123" },
    });
    fireEvent.change(screen.getByLabelText(/model/i), {
      target: { value: "MacBook Pro" },
    });
    fireEvent.change(screen.getByLabelText(/order id/i), {
      target: { value: "ORD001" },
    });
    fireEvent.change(screen.getByLabelText(/install status/i), {
      target: { value: "Deployed" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(addDevice).toHaveBeenCalledWith("computer", {
        serial_number: "SN123",
        model: "MacBook Pro",
        order_id: "ORD001",
        install_status: "Deployed",
      });
    });

    // Loading toggles
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);

    // onSuccess
    expect(onSuccess).toHaveBeenCalled();

    // invalidated correct key
    expect(spyInvalidate).toHaveBeenCalledWith({ queryKey: ["computers"] });
  });

  it("propagates addDevice error to onError and toggles loading", async () => {
    const error = new Error("add failed");
    (addDevice as jest.Mock).mockRejectedValueOnce(error);

    const setIsLoading = jest.fn();
    const onError = jest.fn();

    renderWithClient(
      <DeviceForm
        deviceType="computer"
        mode="add"
        setIsLoading={setIsLoading}
        onError={onError}
      />
    );

    fireEvent.change(screen.getByLabelText(/serial number/i), {
      target: { value: "SNERR" },
    });
    fireEvent.change(screen.getByLabelText(/model/i), {
      target: { value: "X" },
    });
    fireEvent.change(screen.getByLabelText(/order id/i), {
      target: { value: "ORD-ERR" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });

    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });

  // ---------- Update mode (success & error) ----------

  it("calls updateDevice (without serial_number), toggles loading, invalidates 'computers', and calls onSuccess in edit mode", async () => {
    (updateDevice as jest.Mock).mockResolvedValueOnce({ id: "1" });

    const setIsLoading = jest.fn();
    const onSuccess = jest.fn();

    const queryClient = new QueryClient();
    const spyInvalidate = jest.spyOn(queryClient, "invalidateQueries");

    renderWithClient(
      <DeviceForm
        deviceType="computer"
        mode="edit"
        setIsLoading={setIsLoading}
        onSuccess={onSuccess}
        device={{
          id: "1",
          created_at: "2025-08-26T00:00:00Z",
          serial_number: "LOCKED-SN",
          model: "MacBook Air",
          order_id: "ORD999",
          install_status: "In inventory",
        }}
      />,
      queryClient
    );

    // Change model and status
    fireEvent.change(screen.getByLabelText(/model/i), {
      target: { value: "MacBook Air M3" },
    });
    fireEvent.change(screen.getByLabelText(/install status/i), {
      target: { value: "End of life" },
    });

    // Serial number is readOnly
    const sn = screen.getByLabelText(/serial number/i);
    expect(sn).toHaveAttribute("readonly");

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledTimes(1);
    });

    // Ensure payload has NO serial_number
    const [, , updatePayload] = (updateDevice as jest.Mock).mock.calls[0];
    expect(updatePayload.serial_number).toBeUndefined();

    expect(updateDevice).toHaveBeenCalledWith("computer", "1", {
      model: "MacBook Air M3",
      order_id: "ORD999",
      install_status: "End of life",
    });

    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
    expect(onSuccess).toHaveBeenCalled();
    expect(spyInvalidate).toHaveBeenCalledWith({ queryKey: ["computers"] });
  });

  it("propagates updateDevice error to onError and toggles loading", async () => {
    const error = new Error("update failed");
    (updateDevice as jest.Mock).mockRejectedValueOnce(error);

    const setIsLoading = jest.fn();
    const onError = jest.fn();

    renderWithClient(
      <DeviceForm
        deviceType="computer"
        mode="edit"
        setIsLoading={setIsLoading}
        onError={onError}
        device={{
          id: "1",
          created_at: "2025-08-26T00:00:00Z",
          serial_number: "SNE",
          model: "Dell",
          order_id: "ORD-1",
          install_status: "In inventory",
        }}
      />
    );

    fireEvent.change(screen.getByLabelText(/model/i), {
      target: { value: "Dell XPS" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });

    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });

  // ---------- DeviceType-specific behavior ----------

  it("invalidates 'monitors' in add mode when deviceType is monitor", async () => {
    (addDevice as jest.Mock).mockResolvedValueOnce({ id: "m-1" });

    const setIsLoading = jest.fn();
    const onSuccess = jest.fn();
    const queryClient = new QueryClient();
    const spyInvalidate = jest.spyOn(queryClient, "invalidateQueries");

    renderWithClient(
      <DeviceForm
        deviceType="monitor"
        mode="add"
        setIsLoading={setIsLoading}
        onSuccess={onSuccess}
      />,
      queryClient
    );

    fireEvent.change(screen.getByLabelText(/serial number/i), {
      target: { value: "MON-SN" },
    });
    fireEvent.change(screen.getByLabelText(/model/i), {
      target: { value: "Dell 27" },
    });
    fireEvent.change(screen.getByLabelText(/order id/i), {
      target: { value: "MON-ORD" },
    });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(addDevice).toHaveBeenCalledWith("monitor", {
        serial_number: "MON-SN",
        model: "Dell 27",
        order_id: "MON-ORD",
        install_status: "In inventory", // default
      });
    });

    expect(spyInvalidate).toHaveBeenCalledWith({ queryKey: ["monitors"] });
  });

  it("form id reflects deviceType (monitor-form)", () => {
    const { container } = renderWithClient(
      <DeviceForm deviceType="monitor" mode="add" setIsLoading={jest.fn()} />
    );
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("id", "monitor-form");
  });
});
