"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";
import { DeviceForm } from "./DeviceForm";
import type { DeviceType, DeviceRow } from "@/lib/types/devices";

interface DeviceDialogProps {
  deviceType: DeviceType;
  mode: "add" | "edit";
  device?: DeviceRow;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const DeviceDialog: React.FC<DeviceDialogProps> = ({
  deviceType,
  mode,
  device,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onClose,
  onSuccess,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const isEditMode = mode === "edit";
  const deviceName = deviceType === "computer" ? "Computer" : "Monitor";

  const title = isEditMode ? `Edit ${deviceName}` : `Add ${deviceName}`;
  const description = isEditMode
    ? `Update ${deviceType} information in database`
    : `Create new ${deviceType} in database`;
  const submitText = isEditMode ? "Update device" : "Add device";

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) setErrorMessage("");
    else onClose?.();
  };

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleError = (error: unknown) => {
    let message = isEditMode
      ? `Failed to update ${deviceType}`
      : `Failed to add ${deviceType}`;

    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      if (code === "23505") message = `${deviceName} already in database`;
    }

    setErrorMessage(message);
    if (process.env.NODE_ENV === "development") console.error(error);
  };

  const formId = `${deviceType}-form`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DeviceForm
          deviceType={deviceType}
          mode={mode}
          device={device}
          setIsLoading={setIsLoading}
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {errorMessage && (
          <div className="text-red-600 font-medium mt-2">{errorMessage}</div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>

          <Button type="submit" form={formId} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                Please wait
              </>
            ) : (
              submitText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
