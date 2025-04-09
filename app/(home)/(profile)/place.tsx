import { usePlaceStore } from "@/store/usePlaceStore";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Share,
  Alert,
  Platform,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { isOpen } from "@/utils/isOpen";
import { convertTo12HourFormat } from "@/utils/convertTo12HourFormat";
import { Link, Stack } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import * as Location from "expo-location";
import { fetchReviews } from "@/hooks/useFetchReviews";
import { useReviewsStore } from "@/store/useReviewsStore";
import { Review } from "@/types/review";
import Constants from "expo-constants";
import ImageItem from "@/components/ImageItem";
import PlaceImage from "@/components/PlaceImage";
import ReviewImage from "@/components/ReviewImage";
import openGoogleMaps from "@/utils/openGoogleMaps";

const HEADER_HEIGHT = 300; // Fixed height for the MapView

export default function PlaceScreen() {
  const { place } = usePlaceStore();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(place!.like_count);
  const INITIAL_REGION: Region = {
    latitude: place!.latitude,
    longitude: place!.longitude,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  };

  useEffect(() => {
    if (user && place) {
      checkIfLiked();
      checkIfSaved();
    }
  }, [user, place]);

  const onLikePress = async () => {
    try {
      // Fetch the existing like_place array
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("like_place")
        .eq("id", user!.id)
        .single();

      if (fetchError) throw fetchError;

      let updatedLikePlace = profile?.like_place || [];
      let isLiked = updatedLikePlace.includes(place?.uuid);
      let newLikeCount = place!.like_count;

      if (isLiked) {
        // If already liked, remove it
        updatedLikePlace = updatedLikePlace.filter(
          (id: string) => id !== place?.uuid
        );
        newLikeCount = Math.max(newLikeCount - 1, 0); // Ensure it doesn't go negative

        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        // If not liked, add it
        updatedLikePlace.push(place?.uuid);
        newLikeCount += 1;
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }

      // Update the like_place array in Supabase
      const { data, error } = await supabase
        .from("profiles")
        .update({ like_place: updatedLikePlace })
        .eq("id", user!.id)
        .select();

      if (error) throw error;

      // Update the like_count in the place table
      const { data: likePlaceData, error: likePlaceError } = await supabase
        .from("place")
        .update({ like_count: newLikeCount })
        .eq("id", place?.id)
        .select();

      if (likePlaceError) throw likePlaceError;
    } catch (error) {
      console.error("Error updating like_place:", error);
    }
  };

  const onSavePress = async () => {
    try {
      // Fetch the existing like_place array
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("saved_place")
        .eq("id", user!.id)
        .single();

      if (fetchError) throw fetchError;

      let updatedSavedPlace = profile?.saved_place || [];
      let isSave = updatedSavedPlace.includes(place?.uuid);

      if (isSave) {
        // If already saved, remove it
        updatedSavedPlace = updatedSavedPlace.filter(
          (id: string) => id !== place?.uuid
        );
        // Ensure it doesn't go negative

        setIsSaved(false);
      } else {
        updatedSavedPlace.push(place?.uuid);
        setIsSaved(true);
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ saved_place: updatedSavedPlace })
        .eq("id", user!.id)
        .select();

      if (error) throw error;
    } catch (error) {
      console.error("Error updating saved_place:", error);
    }
  };

  const checkIfLiked = async () => {
    try {
      // Fetch the existing like_place array for the user
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("like_place")
        .eq("id", user!.id)
        .single();

      if (fetchError) throw fetchError;

      // Check if the place is already in the like_place array
      const liked = profile?.like_place?.includes(place?.uuid) ?? false;
      setIsLiked(liked);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };
  const checkIfSaved = async () => {
    try {
      // Fetch the existing like_place array for the user
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("saved_place")
        .eq("id", user!.id)
        .single();
      if (fetchError) throw fetchError;

      // Check if the place is already in the like_place array
      const liked = profile?.saved_place?.includes(place?.uuid) ?? false;
      setIsSaved(liked);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const onSharePress = async () => {
    try {
      const shareUrl = getAppLink();
      const result = await Share.share({
        message: `Check out this place on DesiBites: ${place?.name}\n${shareUrl}`,
      });

      if (result.action === Share.sharedAction) {
        console.log("Shared successfully");
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while sharing.");
    }
  };

  const getAppLink = () => {
    const appScheme = "desibites://place/";
    const webUrl = `https://desibites.com/place/${place?.uuid}`;

    if (Constants.appOwnership === "expo") {
      return `exp://192.168.1.10:8081/--/place/${place?.uuid}`; // Dev mode link
    } else {
      return Platform.OS === "ios" ? appScheme + place?.uuid : webUrl;
    }
  };
  useEffect(() => {
    if (!place) return;

    loadImages();
  }, [place]);
  const [files, setFiles] = useState<any[]>([]);
  const loadImages = async () => {
    const { data } = await supabase.storage.from("media").list(place?.uuid);
    if (data) {
      setFiles(data);
    }
  };

  const navigation = useNavigation();
  const scrollY = useSharedValue(0);
  const SCROLL_THRESHOLD = 100;
  // Handle scroll event
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;

    if (event.contentOffset.y > SCROLL_THRESHOLD) {
      navigation.setOptions({
        title: place!.name,
        headerTitleAlign: "center",
        headerShown: true,
      });
    } else {
      navigation.setOptions({ title: "", headerShown: false }); // Hide title when visible in view
    }
  });

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = R * c; // Distance in KM

    if (distanceInKm < 1) {
      return `${(distanceInKm * 1000).toFixed(0)} m`; // Convert to meters
    } else {
      return `${distanceInKm.toFixed(2)} km`; // Keep in kilometers
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation && place) {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.latitude,
        place.longitude
      );
      setDistance(dist);
    }
  }, [userLocation, place]);

  useFocusEffect(
    useCallback(() => {
      getReviews;
    }, [])
  );
  const getReviews = fetchReviews(place!.id);
  const reviews = useReviewsStore((state) => state.reviews);
  // console.log(review);
  return (
    <View className="flex-1 ">
      {/* Fixed Map View */}
      <View style={{ width: "100%", height: HEADER_HEIGHT }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={INITIAL_REGION}
          showsUserLocation={true}
          camera={{
            center: {
              latitude: place!.latitude,
              longitude: place!.longitude,
            },
            pitch: 0,
            heading: 0,
            zoom: 18, // Higher values = Closer to ground
            altitude: 100, // Lower values = Street level zoom
          }}
        >
          <Marker
            coordinate={INITIAL_REGION}
            title="Sample Location"
            description="This is a sample marker"
          />
        </MapView>
      </View>

      {/* Scrollable Content */}
      <View className="py-5 rounded-2xl bg-white -mt-10">
        <FlatList
          data={reviews}
          keyExtractor={(item: Review) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 300 }}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-500 text-lg">
                No reviews available
              </Text>
              <Ionicons name="sad-outline" size={50} color="gray" />
            </View>
          )}
          ListHeaderComponent={
            <Animated.ScrollView
              className="px-5"
              onScroll={scrollHandler}
              scrollEventThrottle={16}
            >
              {/* Place Info */}
              <View className="mt-4 flex flex-row items-start justify-between">
                <View>
                  <Text className="font-bold text-xl">{place?.name}</Text>
                  <Stack.Screen
                    name="place"
                    options={{
                      headerShown: true,
                      headerTitle: place!.name,
                      headerTitleAlign: "center",
                    }}
                  />
                  <View className="flex-row items-center">
                    {place?.review_star !== undefined && (
                      <View className="flex-row items-center gap-2">
                        <Text className="ml-1 text-sm font-semibold text-gray-700">
                          {place?.review_star}
                        </Text>
                        <View className="flex-row">
                          {[...Array(5)].map((_, i) => {
                            const fullStars = Math.floor(place.review_star);
                            const hasHalfStar =
                              place.review_star % 1 !== 0 && i === fullStars;

                            return (
                              <Ionicons
                                key={i}
                                name={
                                  i < fullStars
                                    ? "star"
                                    : hasHalfStar
                                    ? "star-half"
                                    : "star-outline"
                                }
                                size={18}
                                color={
                                  i < fullStars || hasHalfStar
                                    ? "#FFD700"
                                    : "#D3D3D3"
                                } // Gold for filled/half, Light Gray for outline
                              />
                            );
                          })}
                        </View>
                        <Text className="ml-1 text-sm font-semibold text-gray-700">
                          ({place?.review_count})
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="text-sm">
                    {isOpen(place!.opentime, place!.closetime) ? (
                      <View className="flex-row gap-2">
                        <Text className="text-green-500">open</Text>
                        <Text>
                          Closes {convertTo12HourFormat(place!.closetime)}
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row gap-2">
                        <Text className="text-red-500">closed</Text>
                        <Text>
                          opens {convertTo12HourFormat(place!.opentime)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text>At a {distance} Range</Text>
                </View>
                <View>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={24}
                    color="#6b7280"
                  />
                </View>
              </View>

              {/* Buttons */}
              <View className="flex flex-row items-center gap-2 mt-4">
                <TouchableOpacity
                  onPress={() =>
                    openGoogleMaps(place!.latitude, place!.longitude)
                  }
                  className="border rounded-full"
                >
                  <Text className="text-lg font-bold text-center px-4 py-2">
                    Directions
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onSavePress}
                  className="border rounded-full"
                >
                  <Text className="text-lg font-bold text-center px-4 py-2">
                    {isSaved ? "Unsave" : "Save"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onSharePress}
                  className="border rounded-full"
                >
                  <Text className="text-lg font-bold text-center px-4 py-2">
                    Share
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onLikePress}>
                  <Text className="text-lg font-bold text-center text-rose-500 px-4 py-2">
                    {likeCount}
                    {isLiked ? " Unlike" : " Like"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Menu Section */}
              <View className="mt-4">
                <FlatList
                  data={files}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <PlaceImage
                      folder={place!.uuid}
                      key={item.id}
                      item={item}
                      width={200}
                      height={200}
                    />
                  )}
                  ListEmptyComponent={
                    <View
                      style={{ width: 200, height: 200 }}
                      className="bg-gray-200 rounded-xl p-4 text-center items-center justify-center"
                    >
                      <Text className="text-lg text-center font-semibold text-gray-600">
                        No Images Available
                      </Text>
                    </View>
                  }
                  ListFooterComponent={
                    <View
                      style={{ width: 200, height: 200 }}
                      className="bg-gray-200 rounded-xl p-4 mx-2 text-center items-center justify-center"
                    >
                      <Text className="text-lg text-center font-semibold text-gray-600">
                        Add More
                      </Text>
                    </View>
                  }
                  nestedScrollEnabled={true}
                />
              </View>

              {/* Address and Timing */}
              <View className="mt-4 flex gap-4">
                <View className="flex flex-row items-center gap-3">
                  <Ionicons name="location-outline" size={24} color="#6b7280" />
                  <Text className="text-sm">{place?.address}</Text>
                </View>
                <View className="flex flex-row items-center gap-3">
                  <Ionicons name="time-outline" size={24} color="#6b7280" />
                  <View className="text-sm">
                    {isOpen(place!.opentime, place!.closetime) ? (
                      <View className="flex-row gap-2">
                        <Text className="text-green-500">open</Text>
                        <Text>
                          Closes {convertTo12HourFormat(place!.closetime)}{" "}
                          Reopens {convertTo12HourFormat(place!.opentime)}
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row gap-2">
                        <Text className="text-red-500">closed</Text>
                        <Text>
                          opens {convertTo12HourFormat(place!.opentime)} closes{" "}
                          {convertTo12HourFormat(place!.closetime)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Reviews Header */}
              <Text className="text-lg font-bold mt-8 mb-4">Reviews</Text>
              <View className="flex flex-row gap-2 items-center w-full mb-4">
                <View className="h-12 w-12 bg-gray-200 rounded-full"></View>

                <Link href="/(home)/(index)/review" asChild>
                  <TextInput
                    className="bg-gray-100 p-4 rounded-full flex-1"
                    placeholder="Tell others about your experience"
                  />
                </Link>
              </View>
            </Animated.ScrollView>
          }
          renderItem={({ item }) => <ReviewItem review={item} />}
        />
      </View>
    </View>
  );
}

const ReviewItem = ({ review }: { review: Review }) => {
  useEffect(() => {
    if (!review) return;

    loadImages();
  }, [review]);
  const [files, setFiles] = useState<any[]>([]);
  const loadImages = async () => {
    const { data } = await supabase.storage.from("review").list(review?.uuid);
    if (data) {
      setFiles(data);
    }
  };

  return (
    <View className="px-5 py-4 flex gap-2 bg-white  mb-4">
      {/* User Info */}
      <View className="flex flex-row items-center justify-between">
        <View className="flex-row gap-4 items-center space-x-3">
          <Image
            source={{ uri: review.profiles.avatar_url }}
            className="w-12 h-12 rounded-full"
          />
          <View>
            <Text className="text-lg font-semibold">
              {review.profiles.name}
            </Text>
            <Text className="text-sm text-yellow-500">Trusted User</Text>
          </View>
        </View>

        {/* Rating */}
        <View className="flex-row items-center">
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < review.stars ? "star" : "star-outline"}
              size={24}
              color={i < review.stars ? "#FFD700" : "#D3D3D3"}
            />
          ))}
          <Text className="ml-1 text-lg font-semibold text-gray-700">
            {review.stars}
          </Text>
        </View>
      </View>

      {/* Review Text */}
      <Text className="mt-2 text-gray-700">{review.review}</Text>

      {/* Horizontal Image List */}
      <View className="mt-4">
        <FlatList
          data={files}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ReviewImage
              folder={review!.uuid}
              key={item.id}
              item={item}
              width={110}
              height={110}
            />
            // <Text>{item?.uuid}</Text>
          )}
          nestedScrollEnabled={true}
        />
      </View>

      {/* Reply Button */}
      {/* <Text className="mt-3 text-blue-500 font-semibold">Reply</Text> */}
    </View>
  );
};
