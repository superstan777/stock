"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Constants } from "@/lib/types/supabase";
import { addDevice, updateDevice } from "@/lib/fetchers/devices";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type {
  DeviceType,
  DeviceRow,
  DeviceUpdate,
  DeviceInsert,
} from "@/lib/types/devices";

import { UserCombobox } from "./UserCombobox";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/fetchers/users";
import type { UserRow } from "@/lib/types/users";

const deviceSchema = z
  .object({
    serial_number: z.string().trim().min(1, "Serial number is required"),
    model: z.string().trim().min(1, "Model is required"),
    order_id: z.string().trim().min(1, "Order ID is required"),
    install_status: z.enum(Constants.public.Enums.install_status),
    user_email: z.string().email().nullable().optional(),
  })
  .refine(
    (data) =>
      data.install_status !== "Deployed" ||
      (!!data.user_email && data.user_email !== ""),
    {
      message: "User is required",
      path: ["user_email"],
    }
  );

type DeviceFormData = z.infer<typeof deviceSchema>;

export interface DeviceFormProps {
  deviceType: DeviceType;
  mode: "add" | "edit";
  device?: DeviceRow & { user_email?: string | null };
  setIsLoading: (loading: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

const FormField: React.FC<{
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
}> = ({ id, label, children, error }) => (
  <div className="grid gap-3">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {error && <p className="text-red-600 text-sm">{error}</p>}
  </div>
);

export const DeviceForm: React.FC<DeviceFormProps> = ({
  deviceType,
  mode,
  device,
  setIsLoading,
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();
  const isEditMode = mode === "edit";

  const { handleSubmit, control, register, watch, formState } =
    useForm<DeviceFormData>({
      resolver: zodResolver(deviceSchema),
      defaultValues: {
        serial_number: device?.serial_number ?? "",
        model: device?.model ?? "",
        order_id: device?.order_id ?? "",
        install_status: device?.install_status ?? "In inventory",
        user_email: device?.user_email ?? null,
      },
    });

  const installStatus = watch("install_status");
  const userEmail = watch("user_email");

  const { data: users = [] } = useQuery<UserRow[]>({
    queryKey: ["users"],
    queryFn: async () => (await getUsers()).data,
  });

  const mutation = useMutation({
    mutationFn: async (data: DeviceFormData) => {
      const user = users.find((u) => u.email === data.user_email);
      const payload = {
        ...data,
        user_id: user?.id ?? null,
      };
      delete payload.user_email;
      if (isEditMode && device?.id) {
        const { serial_number: _, ...updateData } = payload;
        return updateDevice(deviceType, device.id, updateData as DeviceUpdate);
      }
      return addDevice(deviceType, payload as DeviceInsert);
    },
    onMutate: () => setIsLoading(true),
    onSettled: () => setIsLoading(false),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: [deviceType === "computer" ? "computers" : "monitors"],
      });
    },
    onError: (error) => onError?.(error),
  });

  const onSubmit = (data: DeviceFormData) => mutation.mutate(data);

  return (
    <form
      role="form"
      id={`${deviceType}-form`}
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <FormField
        id="serial_number"
        label="Serial number"
        error={formState.errors.serial_number?.message}
      >
        <Input
          id="serial_number"
          {...register("serial_number")}
          readOnly={isEditMode}
          className={isEditMode ? "bg-gray-50 cursor-not-allowed" : ""}
        />
      </FormField>

      <FormField
        id="model"
        label="Model"
        error={formState.errors.model?.message}
      >
        <Input id="model" {...register("model")} autoFocus={isEditMode} />
      </FormField>

      <FormField
        id="order_id"
        label="Order ID"
        error={formState.errors.order_id?.message}
      >
        <Input id="order_id" {...register("order_id")} />
      </FormField>

      <FormField
        id="install_status"
        label="Install status"
        error={formState.errors.install_status?.message}
      >
        <Controller
          control={control}
          name="install_status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="install_status"
                className="w-full"
                data-testid="install-status-trigger"
                aria-labelledby="install_status-label"
              >
                <SelectValue placeholder="Select install status" />
              </SelectTrigger>
              <SelectContent>
                {Constants.public.Enums.install_status.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      {installStatus === "Deployed" && (
        <FormField
          id="user_email"
          label="User Email"
          error={formState.errors.user_email?.message}
        >
          <Controller
            control={control}
            name="user_email"
            render={({ field }) => (
              <UserCombobox
                value={userEmail ?? null}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
      )}
    </form>
  );
};
