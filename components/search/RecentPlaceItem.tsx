import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StreetFoodPlace } from "@/types/streetFoodPlace";
import { FileObject } from "@supabase/storage-js";
import PlaceImage from "@/components/PlaceImage";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function RecentPlaceItem({
  place,
  onSelect,
  onRemove,
}: {
  place: StreetFoodPlace;
  onSelect: (place: StreetFoodPlace) => void;
  onRemove: (id: number) => void;
}) {
  const [firstFile, setFirstFile] = useState<FileObject | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      const { data, error } = await supabase.storage
        .from("media")
        .list(place.uuid);

      if (data && data.length > 0) {
        setFirstFile(data[0]); // use first image
      }
    };

    loadImages();
  }, [place]);

  return (
    <View key={place.id} className="flex-row items-center justify-between mb-3">
      <TouchableOpacity
        className="flex-row items-center gap-2 flex-1"
        onPress={() => onSelect(place)}
      >
        {firstFile ? (
          <PlaceImage
            folder={place.uuid}
            item={firstFile}
            width={50}
            height={50}
          />
        ) : (
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#e5e5e5",
              borderRadius: 10,
            }}
          />
        )}

        <View className="ml-2">
          <Text className="text-gray-800 font-medium">
            {place.name || "Unnamed Place"}
          </Text>
          <Text className="text-gray-500 text-sm">
            {place.category || "Unknown Category"}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onRemove(place.id)}>
        <Ionicons name="close" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
