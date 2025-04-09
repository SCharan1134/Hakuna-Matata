import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfileEditScreen() {
  const { updateUser, profile: profiles } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    phone_number: "",
    date_off_birth: "",
    avatar_url: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setProfile({
      name: profiles.name,
      gender: profiles.gender,
      phone_number: profiles.phone_number,
      date_off_birth: profiles.date_off_birth,
      avatar_url: profiles.avatar_url,
    });
    setLoading(false);
  };

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      const fileExt = file.uri.split(".").pop();
      const filePath = `avatars/${Date.now()}.${fileExt}`;
      const formData = await fetch(file.uri);
      const blob = await formData.blob();

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, {
          contentType: file.type,
        });

      if (!error) {
        const publicUrl = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath).data.publicUrl;
        setProfile({ ...profile, avatar_url: publicUrl });
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const updates = {
      id: user!.id,
      name: profile.name,
      gender: profile.gender,
      phone_number: profile.phone_number,
      date_off_birth: profile.date_off_birth,
      avatar_url: profile.avatar_url,
      updated_at: new Date(),
    };

    await updateUser(updates);
    setLoading(false);
    alert("Profile updated!");
  };

  return (
    <View className="flex-1 px-4 py-6 bg-gray-50 relative">
      <TouchableOpacity
        onPress={handleImagePick}
        className="self-center mb-6 absolute top-0 rounded-full border border-gray-300 z-20"
      >
        {profile.avatar_url ? (
          <Image
            source={{ uri: profile.avatar_url }}
            className="w-28 h-28 rounded-full border-4 border-white"
          />
        ) : (
          <View className="w-28 h-28 rounded-full bg-gray-200 justify-center items-center">
            <Text className="text-gray-500">Select Avatar</Text>
          </View>
        )}
      </TouchableOpacity>
      <View className="bg-white rounded-lg p-4 border border-gray-300  mt-8">
        <TextInput
          className="border mt-14 border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          placeholder="Name"
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
        />

        <View className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
          <Picker
            selectedValue={profile.gender}
            onValueChange={(itemValue) =>
              setProfile({ ...profile, gender: itemValue })
            }
            mode="dropdown"
            style={{ height: 55 }}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Prefer not to say" value="prefer_not_to_say" />
          </Picker>
        </View>

        <TextInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          maxLength={10}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          value={profile.phone_number}
          onChangeText={(text) =>
            setProfile({ ...profile, phone_number: text })
          }
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            placeholder="Date of Birth"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base text-gray-600"
            value={profile.date_off_birth}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-600 py-3 rounded-lg mt-4"
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-base">
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={
            profile.date_off_birth
              ? new Date(profile.date_off_birth)
              : new Date()
          }
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === "ios");
            if (selectedDate) {
              const formatted = selectedDate.toISOString().split("T")[0];
              setProfile({ ...profile, date_off_birth: formatted });
            }
          }}
        />
      )}
    </View>
  );
}
