import { FlatList, View, Text, TouchableOpacity } from "react-native";
import PlaceCard from "../common/PlaceCard";
import { usePlacesStore } from "@/store/usePlacesStore";
import useLocation from "@/hooks/useLocation";
import { useEffect, useState } from "react";
import { StreetFoodPlace } from "@/types/streetFoodPlace";
import { fetchNearbyPlaces } from "@/lib/api/fetchNearbyPlaces";
import { useNearByPlacesStore } from "@/store/useNearByPlacesStore";

function NearBySheet() {
  const zPlaces = usePlacesStore((state) => state.places);
  const [places, setPlaces] = useState<StreetFoodPlace[]>([]);
  const { places: nearByPlaces } = useNearByPlacesStore();
  const { locationName, location } = useLocation();

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      fetchNearbyPlaces(location.latitude, location.longitude);
    }
    if (nearByPlaces) {
      setPlaces(nearByPlaces);
    }
    // console.log(zPlaces);
  }, []);

  // const OnPressHandle = async () => {
  //   console.log("pressesd");
  //   if (location) {
  //     console.log("handle fetch");
  //     await fetchNearbyPlaces(location.latitude, location.longitude);
  //     console.log("finished fetch");
  //   }
  //   if (nearByPlaces) {
  //     setPlaces(nearByPlaces);
  //   }
  // };
  return (
    <View>
      <Text className="text-2xl px-5 font-semibold">{locationName}</Text>
      {/* <TouchableOpacity
        onPress={OnPressHandle}
        className="flex flex-row items-center gap-2 px-5 mt-2 pb-4 border-b border-gray-300"
      >
        <Text>Press</Text>
      </TouchableOpacity> */}
      <View>
        <FlatList
          className="w-full"
          data={places}
          ItemSeparatorComponent={() => <View className="h-4" />}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: place, index }) => <PlaceCard place={place} />}
          ListEmptyComponent={() => (
            <View className="w-full items-center justify-center py-10">
              <Text className="text-gray-500 text-base">
                No nearby places found.
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

export default NearBySheet;
