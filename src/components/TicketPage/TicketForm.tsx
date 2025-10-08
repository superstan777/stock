"use client";

import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
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
import type { TicketWithUsers } from "@/lib/types/tickets";
import { Constants } from "@/lib/types/supabase";
import { UserCombobox } from "../DevicesPage/UserCombobox";

const ticketSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  status: z.string().trim().min(1, "Status is required"),
  assigned_to: z.email().nullable().optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export interface TicketFormProps {
  ticket: TicketWithUsers;
  setIsLoading?: (loading: boolean) => void;
  onSubmit: (data: TicketFormData) => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({
  ticket,
  setIsLoading,
  onSubmit,
}) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: ticket.title ?? "",
      description: ticket.description ?? "",
      status: ticket.status ?? "new",
      assigned_to: ticket.assigned_to?.email ?? null,
    },
  });

  return (
    <form
      id="ticket-form"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-4"
    >
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

      <div className="flex flex-col gap-4">
        <FormField id="created_at" label="Created at">
          <Input
            id="created_at"
            value={new Date(ticket.created_at).toLocaleString()}
            readOnly
            className="bg-gray-50"
          />
        </FormField>

        <FormField id="status" label="Status" error={errors.status?.message}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => field.onChange(val)}
              >
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
          error={errors.assigned_to?.message}
        >
          <Controller
            control={control}
            name="assigned_to"
            render={({ field }) => (
              <UserCombobox
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
      </div>

      <div className="col-span-2 flex flex-col gap-4">
        <FormField id="title" label="Title" error={errors.title?.message}>
          <Input id="title" {...register("title")} />
        </FormField>

        <FormField
          id="description"
          label="Description"
          error={errors.description?.message}
        >
          <Input id="description" {...register("description")} />
        </FormField>
      </div>
    </form>
  );
};
