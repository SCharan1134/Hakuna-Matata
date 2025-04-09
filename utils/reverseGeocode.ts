import * as Location from "expo-location";
const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (!address) return null;

    // Prioritize district > name > street > city > region
    const isUnnamed = (value?: string | null) =>
      !value || value.toLowerCase().includes("unnamed road");

    let label: string | null = null;

    // Priority 1: District
    if (address.district) label = address.district;

    // Priority 2: Name (not unnamed and not same as district)
    if (
      !label &&
      !isUnnamed(address.name) &&
      address.name !== address.district
    ) {
      label = address.name;
    }

    // Priority 3: City
    if (!label && address.city) {
      label = address.city;
    }

    // Fallback: Smart extract from formattedAddress
    if (
      (!label || label.toLowerCase().includes("unnamed road")) &&
      address.formattedAddress
    ) {
      const segments = address.formattedAddress
        .split(",")
        .map((s) => s.trim())
        .filter(
          (s) =>
            !s.toLowerCase().includes("unnamed road") &&
            !/^\d{6}$/.test(s) && // postal
            !/^\d+[A-Z]*\+/.test(s) // Plus codes
        );

      label = segments[0] || null; // ✅ Take only the first segment
    }

    return label || null;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
  }
};

export default reverseGeocode;
