import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};
