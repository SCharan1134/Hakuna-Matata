import { supabase } from "@/lib/supabase";
import { useReviewsStore } from "@/store/useReviewsStore";

export const fetchReviews = async (placeId: number) => {
  const setReviews = useReviewsStore.getState().setReviews; // <-- use getState here

  if (!placeId) return;
  let { data: reviews, error } = await supabase
    .from("review")
    .select("*,profiles (id, name, avatar_url)")
    .eq("place_id", placeId);

  if (error) {
    console.error("Error fetching Reviews:", error);
  } else if (reviews) {
    setReviews(reviews);
  }
};
