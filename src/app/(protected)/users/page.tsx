"use client";

import ListPage from "@/components/ListPage/ListPage";
import { USER_COLUMNS } from "@/lib/constants";

export default function UsersPage() {
  return <ListPage entityName="User" columns={USER_COLUMNS} />;
}
