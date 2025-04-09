import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useLocation from "@/hooks/useLocation";

function CurrentLocationButton({ _map }: { _map: any }) {
  const { location, refetchLocation } = useLocation();
  const handlePress = async () => {
    await refetchLocation();
    if (location) {
      _map.current?.animateToRegion(location, 500);
    }
  };
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        bottom: 250, // adjust based on your bottom sheet
        right: 20,
        backgroundColor: "white",
        borderRadius: 25,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
      }}
      onPress={async () => {
        _map.current?.animateToRegion(location, 500); // Move map to current location
      }}
    >
      <Ionicons name="locate" size={24} color="black" />
    </TouchableOpacity>
  );
}

export default CurrentLocationButton;
