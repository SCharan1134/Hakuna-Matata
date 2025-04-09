import { useEffect, useState } from "react";
import { usePlaceStore } from "@/store/usePlaceStore";
import { Stack, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { v4 as uuidv4 } from "uuid";
import ReviewImageItem from "@/components/ReviewImageItem";

export default function ReviewPage() {
  const { place } = usePlaceStore();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const router = useRouter();

  const [files, setFiles] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;

    loadImages();
  }, [user]);

  const resetUniqueId = () => {
    const newId = uniqueId; // Get the existing ID
    if (newId === "") {
      const uni = uuidv4(); // Generate new UUID
      setUniqueId(uni); // Update state asynchronously
      return uni;
    }
    return newId; // Return the UUID immediately
  };

  const loadImages = async () => {
    const { data } = await supabase.storage.from("review").list(uniqueId);

    if (data) {
      setFiles(data);
    }
  };

  const onSelectImage = async () => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
        const img = result.assets[0];

        const compressedImage = await ImageManipulator.manipulateAsync(
          img.uri,
          [{ resize: { width: img.width * 0.5, height: img.height * 0.5 } }], // Resize to 50% of original
          { compress: 1, format: ImageManipulator.SaveFormat.PNG } // Reduce quality to 50%
        );

        const base64 = await FileSystem.readAsStringAsync(compressedImage.uri, {
          encoding: "base64",
        });

        const uuid = resetUniqueId(); // ✅ Returns the correct uniqueId

        const filePath = `${uuid}/${new Date().getTime()}.${
          img.type === "image" ? "png" : "mp4"
        }`;

        const contentType = img.type === "image" ? "image/png" : "video/mp4";
        const { data, error } = await supabase.storage
          .from("review")
          .upload(filePath, decode(base64), { contentType });

        if (error) throw error;

        loadImages(); // Load new images after successful upload
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onRemoveImage = async (item: any, listIndex: number) => {
    // supabase.storage.from("files").remove([`${user!.id}/${item.name}`]);
    supabase.storage.from("media").remove([`${uniqueId}/${item.name}`]);
    const newFiles = [...files];
    newFiles.splice(listIndex, 1);
    setFiles(newFiles);
  };

  const handleReviewSubmit = async () => {
    try {
      if (!user || !place) return;
      const { data, error } = await supabase.from("review").insert({
        place_id: place?.id,
        user_id: user.id,
        review: review,
        stars: rating,
        uuid: uniqueId,
      });
      if (error) {
        console.log("Error:", error);
        Alert.alert("Failed to review place. Check logs.");
        return;
      }
      const reviewCount = place.review_count + 1;
      const currentAverage = place.review_star;
      const newAverage =
        (currentAverage * place.review_count + rating) / reviewCount;
      const { data: PlaceData, error: PlaceError } = await supabase
        .from("place")
        .update({
          review_count: reviewCount,
          review_star: newAverage,
          uuid: uniqueId,
        })
        .eq("id", place?.id)
        .select();

      if (PlaceError) {
        console.log("Error:", error);
        Alert.alert("Failed to update place. Check logs.");
        return;
      }
      setUniqueId("");
      router.back();
    } catch (error) {
      console.log("error in submitting the review", error);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white p-4">
      <Stack.Screen
        name="review"
        options={{
          headerShown: true,
          headerTitle: place?.name || "Restaurant",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView className="flex-1 py-5">
        <View className="items-center my-4 flex gap-4">
          <Text className="text-[14px] font-semibold">Shreya Pallati</Text>

          {/* Star Rating */}
          <View className="flex-row my-4 gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={32}
                  color={star <= rating ? "#FFD700" : "#D3D3D3"} // Gold for selected, light gray for unselected
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Review Input */}
          <View className="flex-row items-start w-full px-4">
            <View className="h-12 w-12 bg-gray-200 rounded-full"></View>
            <TextInput
              className="bg-gray-100 flex-1 p-4 rounded-lg ml-2  text-base"
              placeholder="Tell others about your experience"
              value={review}
              onChangeText={setReview}
              editable
              multiline
              numberOfLines={10}
              maxLength={100}
              style={{ minHeight: 200, textAlignVertical: "top" }}
            />
          </View>

          {/* Add Photos Button */}
          <View className="flex gap-3 w-full">
            <TouchableOpacity
              className="flex-row items-center justify-center py-3 border border-gray-300 rounded-lg"
              onPress={
                review
                  ? onSelectImage
                  : () => Alert.alert("Write a review first")
              }
              disabled={!review}
            >
              <Ionicons name="images-outline" size={22} color="black" />
              <Text className="ml-2 text-base">Add Photos</Text>
            </TouchableOpacity>

            {/* Display uploaded images */}
            <View>
              <FlatList
                data={files}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) =>
                  item.id ? item.id : `file-${index}`
                }
                renderItem={({ item, index }) => (
                  <ReviewImageItem
                    folder={uniqueId}
                    key={item.id}
                    item={item}
                    userId={user!.id}
                    onRemoveImage={() => onRemoveImage(item, index)}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Post Button */}
        <View className="flex-1 flex justify-end ">
          <TouchableOpacity
            className={`w-full py-3 mt-6 rounded-full ${
              rating > 0 && review ? "bg-black" : "bg-gray-400"
            }`}
            disabled={!(rating > 0 && review)}
            onPress={handleReviewSubmit}
          >
            <Text className="text-white text-center text-lg">Post</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
