import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import reverseGeocode from "@/utils/reverseGeocode";
import formattedAddress from "@/utils/formattedAddress";

type LocationState = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null;
export default function useLocation() {
  const [location, setLocation] = useState<LocationState>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const currentLocation = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setLocation(region);

    const name = await reverseGeocode(region.latitude, region.longitude);
    if (name !== null && name !== undefined) {
      setLocationName(name);
    }

    const formatted = await formattedAddress(region.latitude, region.longitude);
    if (formatted) {
      setAddress(formatted);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { location, locationName, address, refetchLocation: fetchLocation };
}
