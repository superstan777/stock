"use client";

import { Input } from "@/components/ui/input";
import { FormField } from "../ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import type { UserRow } from "@/lib/types/users";
import { getUsers } from "@/lib/api/users";
import { updateTicket } from "@/lib/api/tickets"; // <- zrobimy taki endpoint analogiczny jak updateDevice
import type { TicketWithUsers } from "@/lib/types/tickets";
import { Constants } from "@/lib/types/supabase";
import { UserCombobox } from "../DevicesPage/UserCombobox";

// --- Schema ---
const ticketSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  status: z.string().trim().min(1, "Status is required"),
  assigned_to_email: z.email().nullable().optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export interface TicketFormProps {
  ticket: TicketWithUsers;
  setIsLoading: (loading: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({
  ticket,
  setIsLoading,
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();

  const { handleSubmit, control, register, formState } =
    useForm<TicketFormData>({
      resolver: zodResolver(ticketSchema),
      defaultValues: {
        title: ticket.title ?? "",
        description: ticket.description ?? "",
        status: ticket.status ?? "new",
        assigned_to_email: ticket.assigned_to?.email ?? null,
      },
    });

  const { data: users = [] } = useQuery<UserRow[]>({
    queryKey: ["users"],
    queryFn: async () => (await getUsers()).data,
  });

  const mutation = useMutation({
    mutationFn: async (data: TicketFormData) => {
      const assignedUser = users.find(
        (u) => u.email === data.assigned_to_email
      );
      const payload = {
        ...data,
        assigned_to: assignedUser?.id ?? null,
      };
      delete payload.assigned_to_email;
      return updateTicket(ticket.id, payload);
    },
    onMutate: () => setIsLoading(true),
    onSettled: () => setIsLoading(false),
    onSuccess: () => {
      toast.success("Ticket has been updated");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to update ticket. Please try again.");
      onError?.(error);
    },
  });

  const onSubmit = (data: TicketFormData) => mutation.mutate(data);

  return (
    <form
      id="ticket-form"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-4"
    >
      {/* --- LEFT COLUMN --- */}
      <div className="flex flex-col gap-4">
        <FormField id="number" label="Number">
          <Input
            id="number"
            value={ticket.number}
            readOnly
            className="bg-gray-50"
          />
        </FormField>

        <FormField id="caller" label="Caller">
          <Input
            id="caller"
            value={ticket.caller?.email ?? "-"}
            readOnly
            className="bg-gray-50"
          />
        </FormField>
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="flex flex-col gap-4">
        <FormField id="created_at" label="Created at">
          <Input
            id="created_at"
            value={new Date(ticket.created_at).toLocaleString()}
            readOnly
            className="bg-gray-50"
          />
        </FormField>

        <FormField
          id="status"
          label="Status"
          error={formState.errors.status?.message}
        >
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Constants.public.Enums.ticket_status.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField
          id="assigned_to"
          label="Assigned to"
          error={formState.errors.assigned_to_email?.message}
        >
          <Controller
            control={control}
            name="assigned_to_email"
            render={({ field }) => (
              <UserCombobox
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
      </div>

      {/* --- FULL-WIDTH FIELDS --- */}
      <div className="col-span-2 flex flex-col gap-4">
        <FormField
          id="title"
          label="Title"
          error={formState.errors.title?.message}
        >
          <Input id="title" {...register("title")} />
        </FormField>

        <FormField
          id="description"
          label="Description"
          error={formState.errors.description?.message}
        >
          <Input id="description" {...register("description")} />
        </FormField>
      </div>
    </form>
  );
};
