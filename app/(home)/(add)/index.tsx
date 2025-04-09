import { useAuth } from "@/providers/AuthProvider";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// ✅ Type all valid icon names using the internal glyphMap
type IoniconName = keyof typeof Ionicons.glyphMap;

export default function index() {
  const { profile } = useAuth();
  const router = useRouter();

  const handleAddPlace = () => {
    console.log("Add Place pressed");
    router.push("/(home)/(add)/addPlace");
  };
  const handleUpdatePlace = () => console.log("Update Place pressed");
  const handleAddReview = () => console.log("Add Review pressed");
  const handleAddPhoto = () => console.log("Add Photo pressed");

  const handleUpdateAddress = () => console.log("Update Address pressed");

  const actions: {
    label: string;
    icon: IoniconName;
    onPress: () => void;
  }[] = [
    {
      label: "Add place",
      icon: "add-circle-outline",
      onPress: handleAddPlace,
    },
    {
      label: "Update place",
      icon: "map-outline",
      onPress: handleUpdatePlace,
    },
    {
      label: "Add review",
      icon: "create-outline",
      onPress: handleAddReview,
    },
    { label: "Add photo", icon: "camera-outline", onPress: handleAddPhoto },

    {
      label: "Update address",
      icon: "location-outline",
      onPress: handleUpdateAddress,
    },
  ];

  return (
    <View className="flex-1 bg-white py-10 px-5">
      <View className="mt-4">
        <Text className="text-2xl font-semibold">{profile.name}</Text>
        <View className="flex flex-row gap-2 items-center mt-2 text-lg">
          <Text>⭐</Text>
          <Text>Local Guide</Text>
          <Text>Level 4</Text>
        </View>
        <View className="flex flex-row gap-4 items-center mt-4 text-lg">
          <Text className="text-orange-400 font-semibold">
            View your profile
          </Text>
          <Text className="text-orange-400 font-semibold">0 followers</Text>
        </View>
      </View>
      <View className=" flex flex-row flex-wrap gap-4 items-center justify-between mt-4">
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            className="w-[90px] items-center justify-center"
            onPress={action.onPress}
          >
            <Ionicons name={action.icon} size={24} color="#00B3E6" />
            <Text className="text-sm text-black text-center mt-1">
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
