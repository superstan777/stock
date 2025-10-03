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
import { AddUserForm } from "../UsersPage/AddUserForm";

import { DeviceForm } from "../DevicesPage/DeviceForm";
import type { EntityType } from "@/lib/types/table";

interface FormDialogProps<T extends EntityType> {
  entity: T;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const FormDialog = <T extends EntityType>({
  entity,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onClose,
  onSuccess,
}: FormDialogProps<T>) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const title = `Add ${entity}`;
  const description = `Create new ${entity} in database`;
  const submitText = `Add ${entity}`;

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
    let message = `Failed to add ${entity}`;

    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      if (code === "23505") message = `${entity} already in database`;
    }

    setErrorMessage(message);
    if (process.env.NODE_ENV === "development") console.error(error);
  };

  const formId = (entity + "-form").replace(/\s+/g, "-");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* DeviceForm - add-only */}
        {(entity === "computer" || entity === "monitor") && (
          <DeviceForm
            mode="add"
            deviceType={entity}
            setIsLoading={setIsLoading}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}

        {/* UserForm - add-only */}
        {entity === "user" && (
          <AddUserForm
            setIsLoading={setIsLoading}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}

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
