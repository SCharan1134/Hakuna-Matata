import { FileObject } from "@supabase/storage-js";
import { Image, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// Image item component that displays the image from Supabase Storage
const ReviewImage = ({
  item,
  folder,
  width = 200,
  height = 200,
}: {
  item: FileObject;
  folder: string;
  width: number;
  height: number;
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
        <Image
          className="rounded-xl"
          style={{ width: width, height: height }}
          source={{ uri: image }}
        />
      ) : (
        <View
          style={{ width: width, height: height, backgroundColor: "#1A1A1A" }}
        />
      )}
    </View>
  );
};

export default ReviewImage;
