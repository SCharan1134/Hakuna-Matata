import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
  Button,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Tabs, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import TimePickerModal from "@/components/TimePicker";
import MapSelector from "@/components/MapSelector";
import * as FileSystem from "expo-file-system";
import { useAuth } from "@/providers/AuthProvider";
import ImageItem from "@/components/ImageItem";
import * as ImageManipulator from "expo-image-manipulator";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";
import { usePlacesStore } from "@/store/usePlacesStore";
import useLocation from "@/hooks/useLocation";
import formattedAddress from "@/utils/formattedAddress";
// import {FileObject} from "@supabase/supabase-js"

type LocationState = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null;
export default function AddPlace() {
  const { user } = useAuth();
  const router = useRouter();
  const [placeName, setPlaceName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [openTime, setOpenTime] = useState<Date | null>(null);
  const [closeTime, setCloseTime] = useState<Date | null>(null);
  const [type, setType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [nearBy, setNearBy] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [location, setLocation] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);

  const [timeVisible, setTimeVisible] = useState(false);

  const addPlace = usePlacesStore((state) => state.addPlace);
  const { address: addressName, location: initailLocation } = useLocation();

  useEffect(() => {
    if (initailLocation) {
      setLocation({
        latitude: initailLocation.latitude,
        longitude: initailLocation.longitude,
      });
    }
  }, [initailLocation]);

  const handleSave = (
    openTime: Date | null,
    closeTime: Date | null,
    type: string
  ) => {
    console.log("Selected Time:", openTime, closeTime, "Type:", type);

    setOpenTime(openTime);
    setCloseTime(closeTime);
    setType(type);
    setModalVisible(false);
  };

  const [files, setFiles] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;

    loadImages();
  }, [user]);

  const loadImages = async () => {
    const { data } = await supabase.storage.from("media").list(uniqueId);
    if (data) {
      setFiles(data);
    }
  };

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const img = result.assets[0];

      const compressedImage = await ImageManipulator.manipulateAsync(
        img.uri,
        [{ resize: { width: img.width * 0.5, height: img.height * 0.5 } }], // Resize to 50% of original
        { compress: 1, format: ImageManipulator.SaveFormat.PNG } // Reduce quality to 50%
      );

      const base64 = await FileSystem.readAsStringAsync(compressedImage.uri, {
        encoding: "base64",
      });
      const filePath = `${uniqueId}/${new Date().getTime()}.${
        img.type === "image" ? "png" : "mp4"
      }`;
      const contentType = img.type === "image" ? "image/png" : "video/mp4";

      const { data, error } = await supabase.storage
        .from("media")
        .upload(filePath, decode(base64), { contentType });
      loadImages();
    }
  };
  const onRemoveImage = async (item: any, listIndex: number) => {
    // supabase.storage.from("files").remove([`${user!.id}/${item.name}`]);
    supabase.storage.from("media").remove([`${uniqueId}/${item.name}`]);
    const newFiles = [...files];
    newFiles.splice(listIndex, 1);
    setFiles(newFiles);
  };

  const convertToSupabaseTimeZ = (
    isoTimestamp: Date,
    timezone: string = "Asia/Kolkata"
  ): string => {
    // Parse the ISO timestamp and convert it to the desired timezone
    const timeZ = moment.utc(isoTimestamp).tz(timezone).format("HH:mm:ssZ");

    return timeZ; // Format: "HH:mm:ss+05:30"
  };
  const onSubmit = async () => {
    try {
      const uuid = uuidv4();
      if (activeStep == 1) {
        const oTime = convertToSupabaseTimeZ(openTime!);
        const cTime = convertToSupabaseTimeZ(closeTime!);
        if (!location) return Alert.alert("Location not found");
        if (!placeName || !category || !address || !openTime || !closeTime) {
          Alert.alert("Missing Fields", "Please fill in all required fields.");
          return;
        }
        setUniqueId(uuid);
        console.log({
          name: placeName,
          category: category,
          address: address,
          landmark: nearBy,
          latitude: location.latitude,
          longitude: location.longitude,
          created_by: user!.id,
          uuid: uuid,
          type: type,
          opentime: oTime,
          closetime: cTime,
        });

        const { data, error } = await supabase
          .from("place")
          .insert({
            name: placeName,
            category: category,
            address: address,
            landmark: nearBy,
            latitude: location.latitude,
            longitude: location.longitude,
            created_by: user!.id,
            uuid: uuid,
            type: type,
            opentime: oTime,
            closetime: cTime,
            review_count: 0,
            like_count: 0,
            review_star: 0.0,
          })
          .select();
        if (error) throw error;
        console.log(data);
        setActiveStep(2);
      } else if (activeStep == 2) {
        // console.log(uniqueId);
        setPlaceName("");
        setCategory("");
        setAddress("");
        setNearBy("");
        setType("");
        setUniqueId("");
        setOpenTime(null);
        setCloseTime(null);

        Alert.alert("Successfully Created Place");
        setActiveStep(1);
        router.push("/(home)/(index)");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-8">
      <ScrollView className="flex-1 bg-white pt-8">
        {/* Section: Place Details */}
        {activeStep == 1 && (
          <View>
            <Text className="text-xl font-semibold mb-1">Place Details</Text>
            <Text className="text-gray-500 text-sm mb-4">
              Provide some information about this place. If it’s added to Hakuna
              Matata maps, it will be visible to everyone.
            </Text>

            {/* Input Fields */}
            <View className="space-y-6 flex gap-6 py-2">
              <TextInput
                className="h-12 border-b border-gray-300 px-3 text-base "
                placeholder="Place name*"
                value={placeName}
                onChangeText={setPlaceName}
              />
              <TextInput
                className="h-12 border-b border-gray-300 px-3 text-base "
                placeholder="Category*"
                value={category}
                onChangeText={setCategory}
              />
              <View className="relative h-12 border-b border-gray-300 flex flex-row items-center justify-between">
                <TextInput
                  className="h-12   text-base"
                  placeholder="Address*"
                  value={address}
                  onChangeText={setAddress}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 0,
                    backgroundColor: "white",
                    padding: 8,
                  }}
                  onPress={async () => {
                    if (!location) return Alert.alert("Location not found");
                    const aName = await formattedAddress(
                      location.latitude,
                      location.longitude
                    );
                    if (aName) {
                      setAddress(aName);
                    }
                  }}
                >
                  <Ionicons name="locate" size={20} color="black" />
                </TouchableOpacity>
              </View>

              <TextInput
                className="h-12 border-b border-gray-300 px-3 text-base"
                placeholder="Located near by"
                value={nearBy}
                onChangeText={setNearBy}
              />
              {/* Map Section */}
              {location && (
                <View className="h-44 rounded-lg overflow-hidden ">
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }}
                    region={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }}
                  >
                    <Marker coordinate={location} title={placeName} />
                  </MapView>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                    }}
                    className="absolute bottom-3 left-3 bg-white border rounded-full px-3 py-2 flex-row items-center"
                  >
                    <Ionicons
                      name="pencil"
                      size={16}
                      className="text-gray-800"
                    />
                    <Text className="text-gray-800 text-sm ml-2">
                      Edit Place Location
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Hours Section */}
              <TouchableOpacity
                onPress={() => setTimeVisible(true)}
                className="flex-row justify-between items-center py-3 border-b border-gray-300 "
              >
                <Text className="text-lg">Hours</Text>
                <Ionicons name="chevron-forward" size={18} color="black" />
              </TouchableOpacity>
              <TimePickerModal
                visible={timeVisible}
                onClose={() => setTimeVisible(false)}
                onSave={handleSave}
              />
            </View>

            {/* Upload Section */}
          </View>
        )}
        {activeStep == 2 && (
          <View>
            <Tabs.Screen
              name="(add)"
              options={{
                headerLeft: () => (
                  <TouchableOpacity
                    className="px-5"
                    onPress={() => setActiveStep(1)}
                  >
                    <Ionicons name="chevron-back" size={28} color="#6b7280" />
                  </TouchableOpacity>
                ),
              }}
            />
            <Text className="text-lg font-semibold my-2">Upload</Text>
            <Text className="text-gray-500 text-sm mb-3">
              Include helpful photos or videos such as the menu, notices, food,
              and the storefront.
            </Text>
            <View className="flex gap-3">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-3 border border-gray-300 rounded-lg"
                onPress={onSelectImage}
              >
                <Ionicons name="images-outline" size={22} color="black" />
                <Text className="ml-2 text-base">Add media</Text>
              </TouchableOpacity>

              {/* Display uploaded images */}
              <View>
                <ScrollView className="flex-row w-full gap-2">
                  {files.map((item, index) => (
                    <ImageItem
                      folder={uniqueId}
                      key={item.id}
                      item={item}
                      userId={user!.id}
                      onRemoveImage={() => onRemoveImage(item, index)}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        )}
        {location && (
          <MapSelector
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSave={(selectedLocation) => {
              // console.log(selectedLocation);
              setLocation(selectedLocation);
            }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          />
        )}
      </ScrollView>
      <View className="flex-row justify-between mt-6 pb-20">
        <TouchableOpacity
          className="flex-1 py-3 bg-gray-200 rounded-lg items-center mr-2"
          onPress={() => {
            router.push("/(home)/(index)");
          }}
        >
          <Text className="text-lg text-black">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSubmit}
          className="flex-1 py-3 bg-red-500 rounded-lg items-center"
        >
          <Text className="text-lg text-white font-bold">
            {activeStep === 1 ? "Continue" : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
