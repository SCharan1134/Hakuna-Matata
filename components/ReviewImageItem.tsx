import { FileObject } from "@supabase/storage-js";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Image item component that displays the image from Supabase Storage and a delte button
const ReviewImageItem = ({
  item,
  userId,
  onRemoveImage,
  folder,
}: {
  item: FileObject;
  folder: string;
  userId: string;
  onRemoveImage: () => void;
}) => {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const { data } = supabase.storage
      .from("review")
      .getPublicUrl(`${folder}/${item.name}`);

    setImage(data.publicUrl);
  }, [item]);

  return (
    <View
      style={{ flexDirection: "row", margin: 1, alignItems: "center", gap: 1 }}
    >
      {image ? (
        <Image style={{ width: 200, height: 200 }} source={{ uri: image }} />
      ) : (
        <View style={{ width: 80, height: 80, backgroundColor: "#1A1A1A" }} />
      )}
      {/* <Text style={{ flex: 1, color: "#fff" }}>{item.name}</Text> */}
      {/* Delete image button */}
      {/* <TouchableOpacity onPress={onRemoveImage}>
        <Ionicons name="trash-outline" size={20} color={"#fff"} />
      </TouchableOpacity> */}
    </View>
  );
};

export default ReviewImageItem;
