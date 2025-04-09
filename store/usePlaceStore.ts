import { StreetFoodPlace } from "@/types/streetFoodPlace";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PlaceStore {
  place: StreetFoodPlace | null;
  fromSearch: boolean;
  setPlace: (newPlace: StreetFoodPlace, fromSearch?: boolean) => void;
  updatePlace: (updatedFields: Partial<StreetFoodPlace>) => void;
  resetFromSearch: () => void;
}

export const usePlaceStore = create<PlaceStore>()(
  persist(
    (set) => ({
      place: null,
      fromSearch: false,
      setPlace: (newPlace, fromSearch = false) =>
        set(() => ({ place: newPlace, fromSearch })),
      updatePlace: (updatedFields) =>
        set((state) => ({
          place: state.place ? { ...state.place, ...updatedFields } : null,
        })),
      resetFromSearch: () => set(() => ({ fromSearch: false })),
    }),
    {
      name: "place-storage",
      storage: createJSONStorage(() => AsyncStorage), // ✅ this resolves your TS error
    }
  )
);
