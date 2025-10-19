import { createClient } from "@/lib/supabase/client";
import type { RelationWithDetails } from "../types/relations";

const supabase = createClient();

export const getRelations = async () => {
  const { data, error } = await supabase
    .from("relations")
    .select(
      `
      id,
      start_date,
      end_date,
      user:users!relations_user_id_fkey(*),
      device:devices!relations_device_id_fkey(*)
    `
    )
    .order("start_date", { ascending: false });

  if (error) throw error;

  return data ?? [];
};

export const getRelationsByDevice = async (
  deviceId: string
): Promise<RelationWithDetails[]> => {
  const { data, error } = await supabase
    .from("relations")
    .select(
      `
      id,
      start_date,
      end_date,
      device:devices!relations_device_id_fkey(*),
      user:users!relations_user_id_fkey(*)
    `
    )
    .eq("device_id", deviceId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((r) => {
    const { device, user, ...relation } = r as unknown as RelationWithDetails;
    return { ...relation, device, user };
  });
};

export const getRelationsByUser = async (
  userId: string
): Promise<RelationWithDetails[]> => {
  const { data, error } = await supabase
    .from("relations")
    .select(
      `
      id,
      start_date,
      end_date,
      device:devices!relations_device_id_fkey(*),
      user:users!relations_user_id_fkey(*)
    `
    )
    .eq("user_id", userId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((r) => {
    const { device, user, ...relation } = r as unknown as RelationWithDetails;
    return { ...relation, device, user };
  });
};

export const createRelation = async ({
  user_id,
  device_id,
  start_date,
}: {
  user_id: string;
  device_id: string;
  start_date: string;
}) => {
  const { data, error } = await supabase
    .from("relations")
    .insert([
      {
        user_id,
        device_id,
        start_date,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const endRelation = async (relationId: string): Promise<void> => {
  const { error } = await supabase
    .from("relations")
    .update({
      end_date: new Date().toISOString(),
    })
    .eq("id", relationId);

  if (error) throw error;
};

export const hasActiveRelation = async (deviceId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("relations")
    .select("id")
    .eq("device_id", deviceId)
    .is("end_date", null)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};
