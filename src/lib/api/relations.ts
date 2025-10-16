import { createClient } from "@/lib/supabase/client";
import type { DeviceType } from "../types/devices";
import type { RelationWithDetails } from "../types/relations";

const supabase = createClient();

export const getRelationsByDevice = async (
  deviceId: string
): Promise<RelationWithDetails[]> => {
  const { data, error } = await supabase
    .from("relations")
    .select(
      `
      id,
      device_type,
      start_date,
      end_date,
      device:devices!relations_device_id_fkey(id, serial_number, model, device_type),
      user:users!relations_user_id_fkey(id, name, email)
    `
    )
    .eq("device_id", deviceId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((r) => {
    const { device, user, ...relation } = r as unknown as RelationWithDetails;

    return {
      ...relation,
      device: {
        id: device.id,
        serial_number: device.serial_number,
        model: device.model,
        device_type: device.device_type,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  });
};

// export const getRelationsByUser = async (
//   userId: string
// ): Promise<RelationWithDevice[]> => {
//   const { data, error } = await supabase
//     .from("relations")
//     .select(
//       `
//       id,
//       start_date,
//       end_date,
//       device:devices(id, serial_number, device_type, model)
//     `
//     )
//     .eq("user_id", userId)
//     .order("start_date", { ascending: false });

//   if (error) throw error;

//   return (
//     data?.map((r) => ({
//       id: r.id,
//       start_date: r.start_date,
//       end_date: r.end_date,
//       device: r.device
//         ? {
//             id: r.device.id,
//             serial_number: r.device.serial_number,
//             model: r.device.model,
//             device_type: r.device.device_type,
//           }
//         : null,
//     })) ?? []
//   );
// };
