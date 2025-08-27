import { render, screen, fireEvent } from "@testing-library/react";
import { PageFooter } from "./PageFooter";
import * as nextNavigation from "next/navigation";

// Mock Next.js router
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams("foo=bar"),
}));

describe("PageFooter", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  test("does not render for totalPages <= 1", () => {
    const { container } = render(<PageFooter currentPage={1} totalPages={1} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders correct number of page items without ellipsis", () => {
    render(<PageFooter currentPage={2} totalPages={5} />);
    const pageLinks = screen.getAllByRole("link", { name: /\d/ });
    expect(pageLinks).toHaveLength(5);
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  test("renders ellipses when totalPages > maxVisiblePages", () => {
    render(<PageFooter currentPage={5} totalPages={20} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getAllByTestId("pagination-ellipsis")).toHaveLength(2);
  });

  test("marks current page as active", () => {
    render(<PageFooter currentPage={3} totalPages={5} />);
    const activePage = screen.getByRole("link", { name: "3" });
    expect(activePage).toHaveAttribute("aria-current", "page"); // assuming PaginationLink sets this
  });

  test("previous button disabled on first page", () => {
    render(<PageFooter currentPage={1} totalPages={5} />);
    const prevButton = screen.getByRole("link", { name: /previous/i });
    expect(prevButton).toHaveClass("pointer-events-none");
  });

  test("next button disabled on last page", () => {
    render(<PageFooter currentPage={5} totalPages={5} />);
    const nextButton = screen.getByRole("link", { name: /next/i });
    expect(nextButton).toHaveClass("pointer-events-none");
  });

  test("clicking page number calls router.push with correct URL", () => {
    render(<PageFooter currentPage={2} totalPages={5} />);
    const page3 = screen.getByRole("link", { name: "3" });
    fireEvent.click(page3);
    expect(pushMock).toHaveBeenCalledWith("?foo=bar&page=3");
  });

  test("clicking previous/next navigates correctly", () => {
    render(<PageFooter currentPage={2} totalPages={5} />);
    const prevButton = screen.getByRole("link", { name: /previous/i });
    const nextButton = screen.getByRole("link", { name: /next/i });

    fireEvent.click(prevButton);
    expect(pushMock).toHaveBeenCalledWith("?foo=bar&page=1");

    fireEvent.click(nextButton);
    expect(pushMock).toHaveBeenCalledWith("?foo=bar&page=3");
  });
});
