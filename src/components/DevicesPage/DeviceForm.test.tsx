import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeviceForm } from "./DeviceForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/api/devices", () => ({
  addDevice: jest.fn(),
  updateDevice: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => {
  const original = jest.requireActual("@tanstack/react-query");
  return {
    ...original,
    useQuery: jest.fn(),
  };
});

jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
}));

import { addDevice, updateDevice } from "@/lib/api/devices";
import { useQuery } from "@tanstack/react-query";

const renderWithClient = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

const mockDevice = {
  id: "1",
  serial_number: "ABC123",
  model: "Dell",
  order_id: "ORD001",
  install_status: "Deployed" as const,
  created_at: null,
  user_id: "user-1",
  user_email: "ethan.brown@stock.pl",
};

describe("DeviceForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // domyślny mock useQuery zwracający pustą listę użytkowników
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
  });

  it("renders form fields when adding a device", () => {
    renderWithClient(
      <DeviceForm
        deviceType="computer"
        setIsLoading={jest.fn()}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/Serial number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Order ID/i)).toBeInTheDocument();
    expect(screen.getByTestId("install-status-trigger")).toBeInTheDocument();
  });

  it("renders form fields with default values when editing a device", () => {
    renderWithClient(
      <DeviceForm
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

  it("validates required fields when adding a device", async () => {
    renderWithClient(
      <DeviceForm
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

  it("validates user_email when install_status is Deployed", async () => {
    renderWithClient(
      <DeviceForm
        deviceType="computer"
        setIsLoading={jest.fn()}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />
    );

    const selectTrigger = screen.getByTestId("install-status-trigger");
    fireEvent.click(selectTrigger);

    const listbox = within(screen.getByRole("listbox"));
    const deployedOption = listbox.getByText("Deployed");
    fireEvent.click(deployedOption);

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(screen.getByText(/User is required/i)).toBeInTheDocument();
    });
  });

  it("calls addDevice when no device is passed", async () => {
    (addDevice as jest.Mock).mockResolvedValueOnce({});
    const setIsLoading = jest.fn();
    const onSuccess = jest.fn();

    renderWithClient(
      <DeviceForm
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
        user_id: null,
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("calls updateDevice when device is passed", async () => {
    (updateDevice as jest.Mock).mockResolvedValueOnce({});
    const onSuccess = jest.fn();

    // mock useQuery aby zwrócić użytkownika
    (useQuery as jest.Mock).mockReturnValue({
      data: [{ id: "user-1", email: "ethan.brown@stock.pl" }],
      isLoading: false,
      isError: false,
    });

    renderWithClient(
      <DeviceForm
        deviceType="computer"
        device={{ ...mockDevice, user_email: "ethan.brown@stock.pl" }}
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
        user_id: "user-1",
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("calls onError when addDevice fails", async () => {
    (addDevice as jest.Mock).mockRejectedValueOnce(new Error("Network error"));
    const onError = jest.fn();

    renderWithClient(
      <DeviceForm
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
