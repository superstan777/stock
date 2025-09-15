"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import ListPage from "@/components/ListPage/ListPage";
import { USER_COLUMNS } from "@/lib/constants";
import { getUsers } from "@/lib/fetchers/users";

export default function UsersPage() {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  const filter = searchParams.get("filter") as "email" | "name" | undefined;
  const query = searchParams.get("query") || undefined;

  const queryKey = "users";

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, currentPage, filter, query],
    queryFn: () =>
      getUsers({
        filter,
        query,
        page: currentPage,
        perPage: 20,
      }),
  });
  const totalPages = Math.ceil((data?.count ?? 0) / 20);

  const pages = { current: currentPage, total: totalPages };

  return (
    <ListPage
      entity="user"
      columns={USER_COLUMNS}
      tableData={data?.data}
      isLoading={isLoading}
      error={error}
      clickableField="name"
      pages={pages}
    />
  );
}
