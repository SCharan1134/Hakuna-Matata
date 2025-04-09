import * as Location from "expo-location";
const formattedAddress = async (latitude: number, longitude: number) => {
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (!address) return null;

    const formatted = address.formattedAddress;

    return formatted || null;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
  }
};

export default formattedAddress;
