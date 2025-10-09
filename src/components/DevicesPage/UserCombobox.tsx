"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getUsers } from "@/lib/api/users";
import type { UserRow } from "@/lib/types/users";

interface UserComboboxProps {
  value: string | null; // UUID
  onChange: (value: string | null) => void;
}

export function UserCombobox({ value, onChange }: UserComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const { data: users = [], isLoading } = useQuery<UserRow[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsers();
      return res.data;
    },
  });

  const selectedUser = users.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Loading...
            </span>
          ) : selectedUser ? (
            selectedUser.email
          ) : (
            "Select user..."
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0"
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command>
          <CommandInput
            placeholder="Search by email..."
            className="h-9 w-full"
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No user found."}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={() => {
                    onChange(user.id); // przekazujemy UUID
                    setOpen(false);
                  }}
                >
                  {user.email}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
