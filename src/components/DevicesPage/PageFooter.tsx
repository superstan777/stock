import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PageFooterProps {
  currentPage: number;
  totalPages: number;
}

export const PageFooter = ({ currentPage, totalPages }: PageFooterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  const handlePageNavigation = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    router.push(createPageUrl(page));
  };

  // Generate smart pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 7; // Total visible page numbers (excluding ellipsis)

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageUrl(i)}
              onClick={(e) => handlePageNavigation(e, i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Complex pagination logic
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

      const firstPageIndex = 1;
      const lastPageIndex = totalPages;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        // Show: 1 2 3 4 5 ... 20
        const leftItemCount = 3 + 2; // 3 + 2*siblingCount
        const leftRange = Array.from(
          { length: leftItemCount },
          (_, i) => i + 1
        );

        leftRange.forEach((page) => {
          items.push(
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
        });

        items.push(
          <PaginationItem key="right-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );

        items.push(
          <PaginationItem key={lastPageIndex}>
            <PaginationLink
              href={createPageUrl(lastPageIndex)}
              onClick={(e) => handlePageNavigation(e, lastPageIndex)}
              isActive={lastPageIndex === currentPage}
            >
              {lastPageIndex}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Show: 1 ... 16 17 18 19 20
        const rightItemCount = 3 + 2;
        const rightRange = Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1
        );

        items.push(
          <PaginationItem key={firstPageIndex}>
            <PaginationLink
              href={createPageUrl(firstPageIndex)}
              onClick={(e) => handlePageNavigation(e, firstPageIndex)}
              isActive={firstPageIndex === currentPage}
            >
              {firstPageIndex}
            </PaginationLink>
          </PaginationItem>
        );

        items.push(
          <PaginationItem key="left-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );

        rightRange.forEach((page) => {
          items.push(
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
        });
      } else {
        // Show: 1 ... 8 9 10 ... 20
        items.push(
          <PaginationItem key={firstPageIndex}>
            <PaginationLink
              href={createPageUrl(firstPageIndex)}
              onClick={(e) => handlePageNavigation(e, firstPageIndex)}
              isActive={firstPageIndex === currentPage}
            >
              {firstPageIndex}
            </PaginationLink>
          </PaginationItem>
        );

        items.push(
          <PaginationItem key="left-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );

        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href={createPageUrl(i)}
                onClick={(e) => handlePageNavigation(e, i)}
                isActive={i === currentPage}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }

        items.push(
          <PaginationItem key="right-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );

        items.push(
          <PaginationItem key={lastPageIndex}>
            <PaginationLink
              href={createPageUrl(lastPageIndex)}
              onClick={(e) => handlePageNavigation(e, lastPageIndex)}
              isActive={lastPageIndex === currentPage}
            >
              {lastPageIndex}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (totalPages <= 1) return null; // Don't show pagination for single page

  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

  return (
    <footer className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(prevPage)}
              onClick={(e) => {
                if (currentPage <= 1) {
                  e.preventDefault();
                  return;
                }
                handlePageNavigation(e, prevPage);
              }}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {generatePaginationItems()}

          <PaginationItem>
            <PaginationNext
              href={createPageUrl(nextPage)}
              onClick={(e) => {
                if (currentPage >= totalPages) {
                  e.preventDefault();
                  return;
                }
                handlePageNavigation(e, nextPage);
              }}
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
