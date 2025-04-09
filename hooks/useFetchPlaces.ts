import { supabase } from "@/lib/supabase";
import { usePlacesStore } from "@/store/usePlacesStore";
import { useEffect } from "react";

export const useFetchPlaces = () => {
  const setPlaces = usePlacesStore((state) => state.setPlaces);

  useEffect(() => {
    const fetchPlaces = async () => {
      let { data: places, error } = await supabase.from("place").select("*");
      //   console.log(places);
      // console.log(error);
      if (error) {
        console.error("Error fetching places:", error);
      } else if (places) {
        // console.log("Places fetched:", places);
        setPlaces(places);
      }
    };

    fetchPlaces();
  }, [setPlaces]);
};
