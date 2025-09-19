"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserRow, UserInsert, UserUpdate } from "@/lib/types/users";

import { addUser, updateUser } from "@/lib/fetchers/users";

const userSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

type UserFormData = z.infer<typeof userSchema>;

export interface UserFormProps {
  mode: "add" | "edit";
  user?: UserRow;
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

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  user,
  setIsLoading,
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();
  const isEditMode = mode === "edit";

  const { handleSubmit, register, formState } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      if (isEditMode && user?.id) {
        return updateUser(user.id, data as UserUpdate);
      }
      return addUser(data as UserInsert);
    },
    onMutate: () => setIsLoading(true),
    onSettled: () => setIsLoading(false),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => onError?.(error),
  });

  const onSubmit = (data: UserFormData) => mutation.mutate(data);

  return (
    <form
      role="form"
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
    </form>
  );
};
