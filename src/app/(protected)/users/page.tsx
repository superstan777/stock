"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ListPage from "@/components/ListPage/ListPage";
import { USER_COLUMNS } from "@/lib/constants";
import { getUsers } from "@/lib/api/users";
import type { UserFilterKeyType } from "@/lib/constants";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const filter = searchParams.get("filter") as UserFilterKeyType | undefined;
  const query = searchParams.get("query") || undefined;

  const queryKey = "users";

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, currentPage, filter, query],
    queryFn: () => getUsers(filter, query, currentPage),
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
