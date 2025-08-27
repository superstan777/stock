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
import { addDevice, updateDevice } from "@/lib/api/devices";
import type { Database } from "@/lib/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeviceType } from "@/lib/types/devices";

type ComputerInsert = Database["public"]["Tables"]["computers"]["Insert"];
type ComputerUpdate = Database["public"]["Tables"]["computers"]["Update"];
type ComputerRow = Database["public"]["Tables"]["computers"]["Row"];

type MonitorInsert = Database["public"]["Tables"]["monitors"]["Insert"];
type MonitorUpdate = Database["public"]["Tables"]["monitors"]["Update"];
type MonitorRow = Database["public"]["Tables"]["monitors"]["Row"];

// Base schema for common fields
const baseDeviceSchema = z.object({
  serial_number: z.string().trim().min(1, "Serial number is required"),
  model: z.string().trim().min(1, "Model is required"),
  order_id: z.string().trim().min(1, "Order ID is required"),
  install_status: z.enum(Constants.public.Enums.install_status),
});

// Type for form data
type DeviceFormData = z.infer<typeof baseDeviceSchema>;

interface DeviceFormProps {
  deviceType: DeviceType;
  mode: "add" | "edit";
  device?: ComputerRow | MonitorRow; // Required for edit mode
  setIsLoading: (loading: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

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

  const formId = `${deviceType}-form`;
  const queryKey = deviceType === "computer" ? "computers" : "monitors";

  const { handleSubmit, control, register, formState } =
    useForm<DeviceFormData>({
      resolver: zodResolver(baseDeviceSchema),
      defaultValues: {
        serial_number: device?.serial_number || "",
        model: device?.model || "",
        order_id: device?.order_id || "",
        install_status: device?.install_status || "In inventory",
      },
    });

  const mutation = useMutation({
    mutationFn: async (data: DeviceFormData) => {
      if (isEditMode && device?.id) {
        // Remove serial_number from update data for security
        const { serial_number: _, ...updateData } = data;

        return updateDevice(
          deviceType,
          device.id,
          updateData as ComputerUpdate | MonitorUpdate
        );
      } else {
        // Include serial_number for new devices
        return addDevice(deviceType, data as ComputerInsert | MonitorInsert);
      }
    },
    onMutate: () => setIsLoading(true),
    onSettled: () => setIsLoading(false),
    onSuccess: () => {
      onSuccess?.();
      // Use refetchQueries instead of invalidateQueries for more control
      queryClient.invalidateQueries({ queryKey: [queryKey] });

      // queryClient.refetchQueries({
      //   queryKey: [queryKey],
      //   exact: true,
      // });
    },
    onError: (error) => onError?.(error),
  });

  const onSubmit = (data: DeviceFormData) => {
    mutation.mutate(data);
  };

  return (
    <form
      role="form"
      key={device?.id || "add"} // Force entire form to re-render when device changes
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <div className="grid gap-3">
        <Label htmlFor="serial_number">Serial number</Label>
        <Input
          id="serial_number"
          {...register("serial_number")}
          readOnly={isEditMode}
          className={isEditMode ? "bg-gray-50 cursor-not-allowed" : ""}
        />
        {formState.errors.serial_number && (
          <p className="text-red-600">
            {formState.errors.serial_number.message}
          </p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="model">Model</Label>
        <Input id="model" {...register("model")} autoFocus={isEditMode} />
        {formState.errors.model && (
          <p className="text-red-600">{formState.errors.model.message}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="install_status">Install status</Label>
        <Controller
          control={control}
          name="install_status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className="w-full"
                data-testid="install-status-trigger"
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
        {formState.errors.install_status && (
          <p className="text-red-600">
            {formState.errors.install_status.message}
          </p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="order_id">Order ID</Label>
        <Input id="order_id" {...register("order_id")} />
        {formState.errors.order_id && (
          <p className="text-red-600">{formState.errors.order_id.message}</p>
        )}
      </div>
    </form>
  );
};
