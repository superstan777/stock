// import { supabase } from "../supabaseClient";

// export const getRelations = async () => {
//   const { data, error } = await supabase.from("relations").select("*");
//   if (error) throw error;
//   return data;
// };

// export const addRelation = async (relation: any) => {
//   const { data, error } = await supabase.from("relations").insert([relation]);
//   if (error) throw error;
//   return data;
// };

// export const deleteRelation = async (id: string) => {
//   const { data, error } = await supabase
//     .from("relations")
//     .delete()
//     .eq("id", id);
//   if (error) throw error;
//   return data;
// };
