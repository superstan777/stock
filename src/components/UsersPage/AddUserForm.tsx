"use client";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUser } from "@/lib/api/users";
import { z } from "zod";
import { Loader2 as Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

type AddUserFormData = z.infer<typeof userSchema>;

export interface AddUserFormProps {
  setIsLoading: (loading: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({
  setIsLoading,
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();

  const { handleSubmit, register, formState } = useForm<AddUserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AddUserFormData) => addUser(data),
    onMutate: () => setIsLoading(true),
    onSettled: () => setIsLoading(false),
    onSuccess: () => {
      onSuccess?.();
      toast.success("User has been added");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Add user failed:", error);
      toast.error("Failed to add user. Please try again.");
    },
  });

  const onSubmit = (data: AddUserFormData) => mutation.mutate(data);

  return (
    <form
      id="user-form"
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <FormField id="name" label="Name" error={formState.errors.name?.message}>
        <Input id="name" {...register("name")} />
      </FormField>

      <FormField
        id="email"
        label="Email"
        error={formState.errors.email?.message}
      >
        <Input id="email" {...register("email")} />
      </FormField>

      {/* <div className="flex justify-end">
        <Button
          type="submit"
          form="add-user-form"
          disabled={mutation.status === "pending"} // zamiast isLoading
        >
          {mutation.status === "pending" ? (
            <>
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
              Please wait
            </>
          ) : (
            "Add User"
          )}
        </Button>
      </div> */}
    </form>
  );
};
