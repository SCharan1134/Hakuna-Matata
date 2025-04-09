import { Linking } from "react-native";

const openGoogleMaps = (latitude: number, longitude: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  Linking.openURL(url);
};

export default openGoogleMaps;
