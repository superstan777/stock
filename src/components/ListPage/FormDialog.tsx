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
import { UserForm } from "../UsersPage/UserForm";
import { DeviceForm } from "../DevicesPage/DeviceForm";

interface FormDialogProps {
  entity: "User" | "Computer" | "Monitor";
  mode: "add" | "edit";
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  entity,
  mode,
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

  const title = isEditMode ? `Edit ${entity}` : `Add ${entity}`;
  const description = isEditMode
    ? `Update ${entity.toLowerCase()} information in database`
    : `Create new ${entity.toLowerCase()} in database`;
  const submitText = isEditMode ? `Update ${entity}` : `Add ${entity}`;

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
      ? `Failed to update ${entity.toLowerCase()}`
      : `Failed to add ${entity.toLowerCase()}`;

    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      if (code === "23505") message = `${entity} already in database`;
    }

    setErrorMessage(message);
    if (process.env.NODE_ENV === "development") console.error(error);
  };

  const formId = (entity.toLowerCase() + "-form").replace(/\s+/g, "-");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {entity === "User" && (
          <UserForm
            mode={mode}
            setIsLoading={setIsLoading}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}

        {entity === "Computer" && (
          <DeviceForm
            deviceType="computer"
            mode={mode}
            setIsLoading={setIsLoading}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}

        {entity === "Monitor" && (
          <DeviceForm
            deviceType="monitor"
            mode={mode}
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
