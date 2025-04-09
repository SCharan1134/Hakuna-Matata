import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetRefProps,
  SNAP_POINTS,
} from "@/components/BottomSheet";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { usePlaceStore } from "@/store/usePlaceStore";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useFetchPlaces } from "@/hooks/useFetchPlaces";
import { usePlacesStore } from "@/store/usePlacesStore";

import mapStyle from "@/config/mapStyle.json";

import Place from "@/pages/Place";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import NearBySheet from "@/components/home/NearBySheet";
import CurrentLocationButton from "@/components/home/CurrentLocationButton";
import useLocation from "@/hooks/useLocation";
import Animated from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

export default function App() {
  const router = useRouter();

  const ref = useRef<BottomSheetRefProps>(null);
  const _map = useRef<MapView | null>(null);

  const { place, fromSearch, resetFromSearch, setPlace } = usePlaceStore();
  const { location } = useLocation();
  const getPlaces = useFetchPlaces();
  const zPlaces = usePlacesStore((state) => state.places);

  const [isPlace, setIsPlace] = useState(false);

  // let mapAnimation = new Animated.Value(0);

  const onPress = useCallback(() => {
    // const isActive = ref?.current?.isActive();
    // if (isActive) {
    //   ref?.current?.scrollTo(SNAP_POINTS.CLOSED); // ❌ already open? close it
    //   //   setIsPlace(false);
    //   //   ref?.current?.scrollTo(SNAP_POINTS.MINI);
    // } else {
    //   ref?.current?.scrollTo(SNAP_POINTS.HALF); // ✅ not active? open to half
    // }
    ref?.current?.scrollTo(SNAP_POINTS.HALF); // ✅ not active? open to half
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo(SNAP_POINTS.MINI);
    }
  }, []);

  // This runs every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      getPlaces;
    }, [])
  );

  useEffect(() => {
    if (place && fromSearch && _map.current && ref.current) {
      _map.current.animateToRegion(
        {
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        800
      );

      ref.current.scrollTo(SNAP_POINTS.HALF);
      setIsPlace(true);

      resetFromSearch(); // reset the flag
    }
  }, [place, fromSearch]);

  // const interpolations = zPlaces.map((marker, index) => {
  //   const inputRange = [
  //     (index - 1) * CARD_WIDTH,
  //     index * CARD_WIDTH,
  //     (index + 1) * CARD_WIDTH,
  //   ];

  //   const scale = mapAnimation.interpolate({
  //     inputRange,
  //     outputRange: [1, 1.5, 1],
  //     extrapolate: "clamp",
  //   });

  //   return { scale };
  // });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <View style={styles.container}> */}
      <StatusBar style="dark" />

      <Link
        href="/(home)/(index)/search"
        style={{ position: "absolute", top: 70, left: 20, right: 20 }}
      >
        <Animated.View
          // exiting={FadeOutUp.duration(350)}
          sharedTransitionTag="search"
          className={" w-full"}
          style={[
            {
              position: "absolute",
              top: 70,
              left: 20,
              right: 20,
              zIndex: 1,
            },
          ]}
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
            <Ionicons name="search" size={20} color="gray" />
            <Text style={{ flex: 1, marginLeft: 10, color: "gray" }}>
              Search here
            </Text>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Image
                source={{
                  uri: "https://avatars.githubusercontent.com/u/1?v=4",
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginLeft: 10,
                }}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Link>

      <CurrentLocationButton _map={_map} />
      <View className="flex-1 bg-white">
        {location ? (
          <MapView
            ref={_map}
            // provider={PROVIDER_GOOGLE}
            style={{ flex: 1, height: height }}
            initialRegion={location}
            customMapStyle={mapStyle}
            showsUserLocation={true}
            showsPointsOfInterest={false}
            showsBuildings={false}
            showsTraffic={false}
            showsIndoors={false}
            showsCompass={false}
            toolbarEnabled={false}
            showsMyLocationButton={false}
          >
            {zPlaces.map((place, index) => {
              //   const scaleStyle = {
              //     transform: [
              //       {
              //         scale: interpolations[index].scale,
              //       },
              //     ],
              //   };

              return (
                <Marker
                  key={place.id}
                  coordinate={{
                    latitude: place.latitude,
                    longitude: place.longitude,
                  }}
                  //   title={place.name}
                  //   description={place.landmark}
                  className="w-[50%] h-[50%]"
                  onPress={() => {
                    setPlace(place);
                    setIsPlace(true);
                    onPress();
                  }}
                >
                  {/* <Animated.View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 50,
                      height: 50,
                    }}
                  >
                    <Animated.Image
                    source={{ uri: place.image }}
                    style={[
                      {
                        width: 30,
                        height: 30,
                      },
                      scaleStyle,
                    ]}
                    resizeMode="cover"
                    className={"rounded-full"}
                  />
                  </Animated.View> */}
                  {/* {place.image && <CustomMarker place={place} />} */}
                </Marker>
              );
            })}
          </MapView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-600">Fetching location...</Text>
          </View>
        )}
      </View>
      <BottomSheet ref={ref}>
        {/* <View style={{ flex: 1, backgroundColor: "orange" }} /> */}
        {isPlace ? (
          <View className="flex-1">{place && <Place />}</View>
        ) : (
          <NearBySheet />
        )}
      </BottomSheet>
      {/* </View> */}
    </GestureHandlerRootView>
  );
}
