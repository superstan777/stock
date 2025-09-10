import { render, screen } from "@testing-library/react";
import DevicesPage from "./DevicesPage";
import { useQuery } from "@tanstack/react-query";

jest.mock("./PageHeader", () => ({
  PageHeader: ({ deviceType }: any) => (
    <div data-testid={`header-${deviceType}`}>Header {deviceType}</div>
  ),
}));
jest.mock("./PageContent", () => ({
  PageContent: ({ deviceType }: any) => (
    <div data-testid={`content-${deviceType}`}>Content {deviceType}</div>
  ),
}));
jest.mock("./PageFooter", () => ({
  PageFooter: ({ currentPage, totalPages }: any) => (
    <div data-testid="footer">
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

// 🔹 Mock useQuery z react-query
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// 🔹 Mock next/navigation
const mockSearchParams = {
  get: jest.fn((key: string) => (key === "page" ? "1" : null)),
};
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

describe("DevicesPage", () => {
  const queryMock = useQuery as jest.Mock;

  beforeEach(() => {
    queryMock.mockReturnValue({
      data: { data: [], count: 0 },
      isLoading: false,
      error: null,
    });
  });

  it("renders header, content and footer", () => {
    render(<DevicesPage deviceType="computer" />);

    expect(screen.getByTestId("header-computer")).toBeInTheDocument();
    expect(screen.getByTestId("content-computer")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toHaveTextContent("Page 1 of 0");
  });

  it("calculates totalPages correctly based on count", () => {
    queryMock.mockReturnValueOnce({
      data: { data: new Array(35).fill({}), count: 35 },
      isLoading: false,
      error: null,
    });

    render(<DevicesPage deviceType="monitor" />);

    expect(screen.getByTestId("footer")).toHaveTextContent("Page 1 of 2");
  });

  it("renders loading state correctly", () => {
    queryMock.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<DevicesPage deviceType="computer" />);

    expect(screen.getByTestId("content-computer")).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    queryMock.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: new Error("Failed"),
    });

    render(<DevicesPage deviceType="computer" />);

    expect(screen.getByTestId("content-computer")).toBeInTheDocument();
  });

  it("uses correct queryKey for computer deviceType", () => {
    render(<DevicesPage deviceType="computer" />);

    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["computers", 1, null, undefined],
      })
    );
  });

  it("uses correct queryKey for monitor deviceType", () => {
    render(<DevicesPage deviceType="monitor" />);

    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["monitors", 1, null, undefined],
      })
    );
  });
});
