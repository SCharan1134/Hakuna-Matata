import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StreetFoodPlace } from "@/types/streetFoodPlace";
import { FileObject } from "@supabase/storage-js";
import PlaceImage from "@/components/PlaceImage";
import { supabase } from "@/lib/supabase";

export default function SearchResultItem({
  place,
  onSelect,
}: {
  place: StreetFoodPlace;
  onSelect: (place: StreetFoodPlace) => void;
}) {
  const [firstFile, setFirstFile] = useState<FileObject | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      const { data } = await supabase.storage.from("media").list(place.uuid);

      if (data && data.length > 0) {
        setFirstFile(data[0]);
      }
    };

    loadImages();
  }, [place]);

  return (
    <TouchableOpacity
      onPress={() => onSelect(place)}
      className="flex-row items-center gap-3 py-3 px-2"
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

      <View>
        <Text className="text-gray-800 font-medium">
          {place.name ?? "Unnamed Place"}
        </Text>
        <Text className="text-gray-500 text-sm">
          {place.category ?? "Unknown Category"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
