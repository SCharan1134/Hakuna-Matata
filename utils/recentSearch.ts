import AsyncStorage from "@react-native-async-storage/async-storage";
import { StreetFoodPlace } from "@/types/streetFoodPlace";

const RECENT_SEARCHES_KEY = "recent_searches";

// Get all recent places
export const getRecentSearches = async (): Promise<StreetFoodPlace[]> => {
  const value = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
  return value ? JSON.parse(value) : [];
};

// Add a place to recent
export const addRecentSearch = async (place: StreetFoodPlace) => {
  //   console.log("Adding to recent search:", place);
  const existing = await getRecentSearches();
  const filtered = existing.filter((p) => p.id !== place.id);
  const updated = [place, ...filtered].slice(0, 5);
  await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};

// Remove a specific place
export const removeRecentSearch = async (id: number) => {
  const existing = await getRecentSearches();
  const updated = existing.filter((p) => p.id !== id);
  await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};

// Clear all
export const clearRecentSearches = async () => {
  await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
};
