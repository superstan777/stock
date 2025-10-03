"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { SearchControls } from "./SearchControls";
import type { ColumnOption, EntityType } from "@/lib/types/table";
import { FormDialog } from "./FormDialog";

interface ListHeaderProps {
  entity: EntityType;
  columns: ColumnOption[];
}

export const ListHeader: React.FC<ListHeaderProps> = ({ entity, columns }) => {
  const pathname = usePathname();
  const title =
    pathname === "/"
      ? "Dashboard"
      : pathname.replace(/^\//, "").replace(/^\w/, (c) => c.toUpperCase());

  return (
    <header className="flex items-center justify-between mb-4 gap-2">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <SearchControls pathname={pathname} columns={columns} />
      </div>

      <FormDialog
        entity={entity}
        trigger={
          <Button className="inline-flex items-center gap-2">
            Add {entity}
          </Button>
        }
      />
    </header>
  );
};
