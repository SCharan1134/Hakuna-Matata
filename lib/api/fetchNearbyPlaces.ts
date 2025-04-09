// lib/api/fetchNearbyPlaces.ts
import { supabase } from "@/lib/supabase";
import { useNearByPlacesStore } from "@/store/useNearByPlacesStore";

export async function fetchNearbyPlaces(userLat: number, userLng: number) {
  console.log("fetching places near you");

  //   console.log(userLat, userLng, 5000);
  const { data, error } = await supabase.rpc("get_places_within_radius", {
    user_lat: userLat,
    user_lng: userLng,
    radius_meters: 5000, // 5 km
  });

  if (error) {
    console.error("Failed to fetch places near you", error);
    return;
  }
  //   console.log(data);

  useNearByPlacesStore.getState().setPlaces(data);
}
