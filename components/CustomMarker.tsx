import { Image, View } from "react-native";

interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  image?: string;
  popular: boolean;
}
interface CustomMarkerProps {
  place: Place;
}
export default function CustomMarker({ place }: CustomMarkerProps) {
  return (
    <View className="h-20 w-20  rounded-full ">
      <Image
        source={{ uri: place.image }}
        className={`${
          place.popular ? "h-12 w-12 border-red-400" : "h-10 w-10"
        } rounded-full border-2 `}
      />
    </View>
  );
}
