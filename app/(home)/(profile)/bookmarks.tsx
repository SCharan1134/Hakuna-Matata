import CardImageList from "@/components/CardImageList";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { usePlaceStore } from "@/store/usePlaceStore";
import { useSavedPlacesStore } from "@/store/useSavedPlacesStore";
import { convertTo12HourFormat } from "@/utils/convertTo12HourFormat";
import { isOpen } from "@/utils/isOpen";
import openGoogleMaps from "@/utils/openGoogleMaps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Linking,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width;

export default function bookmarks() {
  const directionRef = useRef();
  const router = useRouter();
  const { user } = useAuth();
  const { setPlace } = usePlaceStore();
  const setPlaces = useSavedPlacesStore((state) => state.setPlaces);
  const getSavedPlaces = async () => {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("saved_place")
        .eq("id", user!.id)
        .single();
      if (fetchError) throw fetchError;

      const savedPlaceuuids = profile?.saved_place || [];

      const { data, error } = await supabase
        .from("place")
        .select("*")
        .in("uuid", savedPlaceuuids);

      if (error) throw error;
      if (data) {
        setPlaces(data);
      }
    } catch (error) {
      console.error("Error retrieving saved places:", error);
      return [];
    }
  };

  useEffect(() => {
    getSavedPlaces();
  });

  const SavedPlaces = useSavedPlacesStore((state) => state.places);

  return (
    <View className="bg-gray-50 flex-1 px-2">
      {/* <Text className="text-2xl font-semibold mt-4 px-2">Bookmarks</Text> */}
      <FlatList
        className="w-full"
        data={SavedPlaces}
        ItemSeparatorComponent={() => <View className="h-4" />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: place, index }) => (
          <GestureHandlerRootView key={index} className="">
            <TapGestureHandler
              waitFor={directionRef}
              onActivated={() => {
                router.push("/(home)/(profile)/place");
                setPlace(place);
              }}
            >
              <View
                className="bg-[#fff] w-full mr-4 rounded-xl  shadow-md shadow-black/30 overflow-hidden p-4"
                key={index}
                style={{
                  elevation: 2,
                }}
              >
                <View className="w-full h-auto flex-row overflow-hidden">
                  <CardImageList Place={place} />
                </View>

                <View className="flex flex-row gap-2 items-center justify-between mt-4">
                  <View>
                    <Text numberOfLines={1} className="text-lg font-semibold">
                      {place.name}
                    </Text>
                    <View className="flex flex-row items-center gap-1 mt-1">
                      <Text className="text-sm">⭐({place.review_count})</Text>

                      <View>
                        {isOpen(place!.opentime, place!.closetime) ? (
                          <View className="flex-row gap-2">
                            <Text className="text-green-500 text-sm">open</Text>
                            <Text className="text-sm">
                              Closes {convertTo12HourFormat(place!.closetime)}
                            </Text>
                          </View>
                        ) : (
                          <View className="flex-row gap-2">
                            <Text className="text-red-500 text-sm">closed</Text>
                            <Text className="text-sm">
                              opens {convertTo12HourFormat(place!.opentime)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <TapGestureHandler
                    ref={directionRef}
                    numberOfTaps={1}
                    onActivated={() => {
                      openGoogleMaps(place.latitude, place.longitude);
                    }}
                  >
                    <TouchableOpacity className=" p-2 flex flex-row gap-2 items-center justify-center rounded-lg border border-black ">
                      <Ionicons name="navigate" size={20} color="black" />
                      <Text className="font-bold text-sm ">Directions</Text>
                    </TouchableOpacity>
                  </TapGestureHandler>
                </View>
              </View>
            </TapGestureHandler>
          </GestureHandlerRootView>
        )}
      />
    </View>
  );
}
