import { FileObject } from "@supabase/storage-js";
import { FlatList, Image, View, Text } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { StreetFoodPlace } from "@/types/streetFoodPlace";
import PlaceImage from "./PlaceImage";

// Image item component that displays the image from Supabase Storage
const CardImageList = ({ Place }: { Place: StreetFoodPlace }) => {
  const [files, setFiles] = useState<any[]>([]);
  const loadImages = async () => {
    const { data, error } = await supabase.storage
      .from("media")
      .list(Place?.uuid);
    if (data) {
      setFiles(data);
    }
  };
  useEffect(() => {
    if (!Place) return;
    loadImages();
  }, [Place]);
  return (
    <FlatList
      data={files}
      className="flex-row gap-2"
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <PlaceImage
          folder={Place!.uuid}
          key={item.id}
          item={item}
          width={110}
          height={110}
        />
      )}
      ListEmptyComponent={
        <View
          style={{ width: 110, height: 110 }}
          className="bg-gray-200 rounded-xl p-4 text-center items-center justify-center"
        >
          <Text className="text-sm text-center font-semibold text-gray-600">
            No Images Available
          </Text>
        </View>
      }
      ListFooterComponent={
        files.length > 0 ? (
          <View
            style={{ width: 110, height: 110 }}
            className="bg-gray-200 rounded-xl p-4  text-center items-center justify-center"
          >
            <Text className="text-sm text-center font-semibold text-gray-600">
              View More
            </Text>
          </View>
        ) : null
      }
      nestedScrollEnabled={true}
    />
  );
};

export default CardImageList;
