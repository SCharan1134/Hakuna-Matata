import { usePlaceStore } from "@/store/usePlaceStore";
import { StreetFoodPlace } from "@/types/streetFoodPlace";
import { useRouter } from "expo-router";
import { Linking, View, Text, TouchableOpacity } from "react-native";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import CardImageList from "../CardImageList";
import { isOpen } from "@/utils/isOpen";
import { convertTo12HourFormat } from "@/utils/convertTo12HourFormat";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import openGoogleMaps from "@/utils/openGoogleMaps";

function PlaceCard({ place }: { place: StreetFoodPlace }) {
  const { setPlace } = usePlaceStore();
  const router = useRouter();
  const directionRef = useRef();

  return (
    <GestureHandlerRootView>
      <TapGestureHandler
        waitFor={directionRef}
        onActivated={() => {
          console.log("pressed");
          setPlace(place, true);
        }}
      >
        <View
          className="bg-[#fff] w-full  mr-4 rounded-xl  shadow-md shadow-black/30 overflow-hidden py-4 px-2"
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
  );
}

export default PlaceCard;
