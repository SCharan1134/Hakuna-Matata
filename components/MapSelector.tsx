import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import CurrentLocationButton from "./home/CurrentLocationButton";

interface MapSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (location: { latitude: number; longitude: number }) => void;
  initialRegion: Region;
}

const MapSelector: React.FC<MapSelectorProps> = ({
  visible,
  onClose,
  onSave,
  initialRegion,
}) => {
  const [mapRegion, setMapRegion] = useState<Region>(initialRegion);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: initialRegion.latitude,
    longitude: initialRegion.longitude,
  });

  const _map = useRef<MapView | null>(null);

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View className="flex-1 bg-white">
        <Text className="text-lg font-bold text-center p-4">
          Select Location
        </Text>
        <CurrentLocationButton _map={_map} />
        <MapView
          ref={_map}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={mapRegion}
          onRegionChange={(region) => {
            setMapRegion(region);
            setSelectedLocation({
              latitude: region.latitude,
              longitude: region.longitude,
            });
          }}
        >
          <Marker coordinate={selectedLocation} />
        </MapView>

        <View className="p-4">
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-md"
            onPress={() => {
              onSave(selectedLocation);
              onClose();
            }}
          >
            <Text className="text-white text-center font-bold">
              Set Location
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="mt-2 p-2" onPress={onClose}>
            <Text className="text-center text-red-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MapSelector;
