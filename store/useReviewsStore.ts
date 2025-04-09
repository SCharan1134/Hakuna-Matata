import { Review } from "@/types/review";
import { create } from "zustand";

interface ReviewStore {
  reviews: Review[];
  setReviews: (newPlaces: Review[]) => void;
  addReview: (newPlace: Review) => void;
  updateReview: (id: number, updatedFields: Partial<Review>) => void;
  removeReview: (id: number) => void;
}

export const useReviewsStore = create<ReviewStore>((set) => ({
  reviews: [], // Initially an empty array
  setReviews: (newReviews) => set({ reviews: newReviews }),
  addReview: (newReview) =>
    set((state) => ({ reviews: [...state.reviews, newReview] })),
  updateReview: (id, updatedFields) =>
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review.id === id ? { ...review, ...updatedFields } : review
      ),
    })),
  removeReview: (id) =>
    set((state) => ({
      reviews: state.reviews.filter((review) => review.id !== id),
    })),
}));
