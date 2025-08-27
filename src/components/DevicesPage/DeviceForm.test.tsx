import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeviceForm } from "./DeviceForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// mock API
jest.mock("@/lib/api/devices", () => ({
  addDevice: jest.fn(),
  updateDevice: jest.fn(),
}));

import { addDevice, updateDevice } from "@/lib/api/devices";

// utility wrapper with react-query client
const renderWithClient = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

// mock device for edit mode
const mockDevice = {
  id: "1",
  serial_number: "ABC123",
  model: "Dell",
  order_id: "ORD001",
  install_status: "Deployed" as const,
  created_at: null,
};

describe("DeviceForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields in add mode", () => {
    renderWithClient(
      <DeviceForm
        mode="add"
        deviceType="computer"
        setIsLoading={jest.fn()}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/Serial number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Order ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Install status/i)).toBeInTheDocument();
  });

  it("renders form fields with default values in edit mode", () => {
    renderWithClient(
      <DeviceForm
        mode="edit"
        deviceType="computer"
        device={mockDevice}
        setIsLoading={jest.fn()}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue("ABC123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dell")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ORD001")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    renderWithClient(
      <DeviceForm
        mode="add"
        deviceType="computer"
        setIsLoading={jest.fn()}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(
        screen.getByText(/Serial number is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Model is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Order ID is required/i)).toBeInTheDocument();
    });
  });

  it("submits addDevice in add mode", async () => {
    (addDevice as jest.Mock).mockResolvedValueOnce({});

    const setIsLoading = jest.fn();
    const onSuccess = jest.fn();

    renderWithClient(
      <DeviceForm
        mode="add"
        deviceType="computer"
        setIsLoading={setIsLoading}
        onSuccess={onSuccess}
        onError={jest.fn()}
      />
    );

    await userEvent.type(screen.getByLabelText(/Serial number/i), "SN123");
    await userEvent.type(screen.getByLabelText(/Model/i), "HP");
    await userEvent.type(screen.getByLabelText(/Order ID/i), "ORDER-9");

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(addDevice).toHaveBeenCalledWith("computer", {
        serial_number: "SN123",
        model: "HP",
        order_id: "ORDER-9",
        install_status: "In inventory",
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("submits updateDevice in edit mode", async () => {
    (updateDevice as jest.Mock).mockResolvedValueOnce({});

    const onSuccess = jest.fn();

    renderWithClient(
      <DeviceForm
        mode="edit"
        deviceType="computer"
        device={mockDevice}
        setIsLoading={jest.fn()}
        onSuccess={onSuccess}
        onError={jest.fn()}
      />
    );

    const modelInput = screen.getByLabelText(/Model/i);
    await userEvent.clear(modelInput);
    await userEvent.type(modelInput, "Lenovo");

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledWith("computer", "1", {
        model: "Lenovo",
        order_id: "ORD001",
        install_status: "Deployed",
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("calls onError when request fails", async () => {
    (addDevice as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const onError = jest.fn();

    renderWithClient(
      <DeviceForm
        mode="add"
        deviceType="computer"
        setIsLoading={jest.fn()}
        onSuccess={jest.fn()}
        onError={onError}
      />
    );

    await userEvent.type(screen.getByLabelText(/Serial number/i), "SN123");
    await userEvent.type(screen.getByLabelText(/Model/i), "HP");
    await userEvent.type(screen.getByLabelText(/Order ID/i), "ORDER-9");

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
