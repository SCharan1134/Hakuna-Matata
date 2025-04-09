import { StreetFoodPlace } from "@/types/streetFoodPlace";
import { create } from "zustand";

interface LikedPlaceStore {
  places: StreetFoodPlace[];
  setPlaces: (newPlaces: StreetFoodPlace[]) => void;
  addPlace: (newPlace: StreetFoodPlace) => void;
  updatePlace: (id: number, updatedFields: Partial<StreetFoodPlace>) => void;
  removePlace: (id: number) => void;
}

export const useLikedPlacesStore = create<LikedPlaceStore>((set) => ({
  places: [], // Initially an empty array
  setPlaces: (newPlaces) => set({ places: newPlaces }),
  addPlace: (newPlace) =>
    set((state) => ({ places: [...state.places, newPlace] })),
  updatePlace: (id, updatedFields) =>
    set((state) => ({
      places: state.places.map((place) =>
        place.id === id ? { ...place, ...updatedFields } : place
      ),
    })),
  removePlace: (id) =>
    set((state) => ({
      places: state.places.filter((place) => place.id !== id),
    })),
}));
