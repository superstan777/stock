import { createClient } from "@/lib/supabase/client";
import type { RelationFilterKeyType } from "../consts/relations";
import type { RelationWithDetails } from "../types/relations";

const supabase = createClient();

export const getRelations = async (
  filter?: RelationFilterKeyType,
  query?: string,
  page: number = 1,
  perPage: number = 20
) => {
  const selectFields = `
    id,
    start_date,
    end_date,
    user:users!relations_user_id_fkey(*),
    device:devices!relations_device_id_fkey(*)
  `;

  let q = supabase
    .from("relations")
    .select(selectFields, { count: "exact" })
    .order("start_date", { ascending: false });

  if (filter && query) {
    q = q.ilike(filter, `${query}%`);
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
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
