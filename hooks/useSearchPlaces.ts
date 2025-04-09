import { supabase } from "@/lib/supabase";

export const useSearchPlaces = () => {
  const searchPlaces = async (query: string) => {
    const { data, error } = await supabase
      .from("place")
      .select("*")
      .or(
        `name.ilike.%${query}%,category.ilike.%${query}%,type.ilike.%${query}%`
      )
      .limit(10);

    if (error) throw error;
    return data;
  };

  return { searchPlaces };
};
