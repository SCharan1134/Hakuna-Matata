import { useSearchPlaces } from "@/hooks/useSearchPlaces";
import { usePlaceStore } from "@/store/usePlaceStore";
import { StreetFoodPlace } from "@/types/streetFoodPlace";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from "@/utils/recentSearch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, Text } from "react-native";
import { TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import debounce from "lodash/debounce";
import RecentPlaceItem from "@/components/search/RecentPlaceItem";
import SearchResultItem from "@/components/search/SearchResultItem";
import { TextInput as RNTextInput } from "react-native";

export default function search() {
  const router = useRouter();
  const { setPlace } = usePlaceStore();
  const { searchPlaces } = useSearchPlaces();

  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<StreetFoodPlace[]>([]);
  const [results, setResults] = useState<StreetFoodPlace[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    // Focus the input when screen loads
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    getRecentSearches().then(setRecent);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    debouncedSearch(q);
  };

  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) return setResults([]);
      setLoading(true);
      try {
        const data = await searchPlaces(q);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      }
      setLoading(false);
    }, 500),
    []
  );

  const selectPlace = async (place: any) => {
    await addRecentSearch(place);
    setPlace(place, true);
    setTimeout(() => {
      router.back();
    }, 50);
  };

  const handleClearAll = async () => {
    await clearRecentSearches();
    setRecent([]);
  };

  return (
    <View className="bg-white flex-1 ">
      {/* <Text className="text-white text-2xl font-bold p-4">Search</Text> */}
      <Animated.View
        // entering={FadeInDown.duration(350)}
        sharedTransitionTag="search"
        className={"pt-20 px-5"}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 50,
            paddingHorizontal: 16,
            paddingVertical: 10,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          <Ionicons
            name="arrow-back"
            onPress={() => router.back()}
            size={20}
            color="gray"
          />
          <TextInput
            autoFocus
            ref={inputRef}
            placeholder="Search here"
            placeholderTextColor="gray"
            style={{ flex: 1, marginLeft: 10 }}
            value={query}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      {query === "" ? (
        <View className="px-5 py-2">
          <FlatList
            data={recent}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <RecentPlaceItem
                place={item}
                onSelect={selectPlace}
                onRemove={async (id) => {
                  await removeRecentSearch(id);
                  setRecent((prev) => prev.filter((p) => p.id !== id));
                }}
              />
            )}
            ListHeaderComponent={() =>
              recent.length > 0 ? (
                <View className="flex-row justify-between items-center mb-5 py-3">
                  <Text className="text-lg font-normal text-gray-600">
                    Your Recent Searches
                  </Text>
                  <TouchableOpacity onPress={handleClearAll}>
                    <Text className="text-red-500 text-sm">Clear All</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
            ItemSeparatorComponent={() => <View className="h-2" />}
            ListEmptyComponent={() => (
              <View className="mt-10 items-center justify-center">
                <Text className="text-gray-500 text-center text-base">
                  No recent searches yet.
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Start searching for places and they’ll appear here!
                </Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View className="px-5">
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SearchResultItem place={item} onSelect={selectPlace} />
            )}
            ListEmptyComponent={() => {
              if (query.trim() === "" || loading) return null; // ✅ prevent showing too early
              return (
                <View className="mt-10 items-center justify-center">
                  <Text className="text-gray-500 text-center text-base">
                    No results found for “{query}”
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">
                    Try a different keyword.
                  </Text>
                </View>
              );
            }}
            ItemSeparatorComponent={() => <View className="h-2" />}
            ListHeaderComponent={() =>
              loading ? (
                <Text className="text-center text-gray-500 my-4">
                  Searching...
                </Text>
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
}
