"use client";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/fetchers/users";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Loader2 as Loader2Icon } from "lucide-react";
import type { UserRow, UserUpdate } from "@/lib/types/users";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserPageProps {
  user: UserRow;
}

export const UserForm: React.FC<UserPageProps> = ({ user }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { handleSubmit, register, formState } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UserFormData) => updateUser(user.id, data as UserUpdate),
    onSuccess: () => {
      toast.success("User has been updated");

      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.refresh();
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });

  const onSubmit = (data: UserFormData) => mutation.mutate(data);

  return (
    <form
      id="user-form"
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 p-4 max-w-md mx-auto"
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

      <div className="flex justify-end">
        <Button
          type="submit"
          form="user-form"
          disabled={mutation.status === "pending"}
        >
          {mutation.status === "pending" ? (
            <>
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
              Please wait
            </>
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </form>
  );
};
