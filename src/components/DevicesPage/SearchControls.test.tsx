import { render, screen } from "@testing-library/react";
import { SearchControls } from "./SearchControls";
import userEvent from "@testing-library/user-event";
import { Constants } from "@/lib/types/supabase";
import { columns } from "./DevicesPage";

const mockPush = jest.fn();

const mockSearchParams = {
  get: jest.fn((key: string) => null),
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

beforeAll(() => {
  HTMLElement.prototype.hasPointerCapture = jest.fn(() => false);
  HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe("SearchControls", () => {
  beforeEach(() => {
    mockPush.mockClear();
    render(<SearchControls pathname="/computers" />);
  });

  const firstInstallStatus = Constants.public.Enums.install_status[0];
  const firstFilter = columns[0].value;
  const secondFilterLabel = columns[1].label; // np. "Model"

  it("renders filter select, input, and buttons", () => {
    expect(screen.getByLabelText("Filter by")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
  });

  it("updates input value on typing", async () => {
    const input = screen.getByPlaceholderText("Search");
    await userEvent.type(input, "test query");
    expect(input).toHaveValue("test query");
  });

  it("enables clear button when input has value", async () => {
    const input = screen.getByPlaceholderText("Search");
    const clearButton = screen.getByRole("button", { name: /clear/i });

    expect(clearButton).toBeDisabled();
    await userEvent.type(input, "something");
    expect(clearButton).not.toBeDisabled();
  });

  it("calls router.push with correct query on search button click", async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("Search");
    const searchButton = screen.getByRole("button", { name: "Search" });

    await user.type(input, "abc");
    await user.click(searchButton);

    expect(mockPush).toHaveBeenCalled();
    const calledUrl = mockPush.mock.calls[0][0];
    expect(calledUrl).toContain(`filter=${firstFilter}`);
    expect(calledUrl).toContain("query=abc");
    expect(calledUrl).toContain("page=1");
  });

  it("clears input and updates router on clear button click", async () => {
    const input = screen.getByPlaceholderText("Search");
    const clearButton = screen.getByRole("button", { name: "Clear" });

    await userEvent.type(input, "abc");
    await userEvent.click(clearButton);

    expect(input).toHaveValue("");
    expect(mockPush).toHaveBeenCalled();
    const calledUrl = mockPush.mock.calls[0][0];
    expect(calledUrl).not.toContain("query=abc");
  });

  it("switches to install_status select and clears input when filter changes", async () => {
    const input = screen.getByPlaceholderText("Search");
    await userEvent.type(input, "abc");

    const filterSelectTrigger = screen.getByLabelText("Filter by");
    await userEvent.click(filterSelectTrigger);

    const installStatusOption = await screen.findByText("Install Status");
    await userEvent.click(installStatusOption);

    const statusSelect = screen.getByLabelText("Select status");
    expect(statusSelect).toBeInTheDocument();
    expect(statusSelect).toHaveValue("");
  });

  it("updates input when selecting an install_status value", async () => {
    const user = userEvent.setup();

    const filterSelectTrigger = screen.getByLabelText("Filter by");
    await user.click(filterSelectTrigger);

    const installStatusOption = await screen.findByText("Install Status");
    await userEvent.click(installStatusOption);

    const statusSelectTrigger = screen.getByLabelText("Select status");
    await userEvent.click(statusSelectTrigger);

    const firstOption = await screen.findByRole("option", {
      name: firstInstallStatus,
    });
    await userEvent.click(firstOption);

    expect(statusSelectTrigger).toHaveTextContent(firstInstallStatus);
  });

  it("does not clear input when changing to a non-install_status filter", async () => {
    const input = screen.getByPlaceholderText("Search");
    await userEvent.type(input, "abc");

    const filterSelectTrigger = screen.getByLabelText("Filter by");
    await userEvent.click(filterSelectTrigger);
    const secondFilterOption = await screen.findByText(secondFilterLabel);
    await userEvent.click(secondFilterOption);

    expect(input).toHaveValue("abc");
  });
});
