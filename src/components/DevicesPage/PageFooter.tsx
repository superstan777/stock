"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PageFooterProps {
  currentPage: number;
  totalPages: number;
}

export const PageFooter = ({ currentPage, totalPages }: PageFooterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siblingCount = 1;
  const maxVisiblePages = 7;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  const handlePageNavigation = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    router.push(createPageUrl(page));
  };

  const renderPageItem = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink
        href={createPageUrl(page)}
        onClick={(e) => handlePageNavigation(e, page)}
        isActive={page === currentPage}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  );

  const paginationItems = useMemo(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) =>
        renderPageItem(i + 1)
      );
    }

    const items: React.ReactNode[] = [];
    const left = Math.max(currentPage - siblingCount, 2);
    const right = Math.min(currentPage + siblingCount, totalPages - 1);

    // First page
    items.push(renderPageItem(1));

    // Left ellipsis
    if (left > 2)
      items.push(
        <PaginationItem key="left-ellipsis">
          <PaginationEllipsis data-testid="pagination-ellipsis" />
        </PaginationItem>
      );

    // Middle pages
    for (let i = left; i <= right; i++) {
      items.push(renderPageItem(i));
    }

    // Right ellipsis
    if (right < totalPages - 1)
      items.push(
        <PaginationItem key="right-ellipsis">
          <PaginationEllipsis data-testid="pagination-ellipsis" />
        </PaginationItem>
      );

    // Last page
    items.push(renderPageItem(totalPages));

    return items;
  }, [currentPage, totalPages, searchParams]);

  if (totalPages <= 1) return null;

  const prevPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, totalPages);

  return (
    <footer className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(prevPage)}
              onClick={(e) =>
                currentPage > 1 && handlePageNavigation(e, prevPage)
              }
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {paginationItems}

          <PaginationItem>
            <PaginationNext
              href={createPageUrl(nextPage)}
              onClick={(e) =>
                currentPage < totalPages && handlePageNavigation(e, nextPage)
              }
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </footer>
  );
};
