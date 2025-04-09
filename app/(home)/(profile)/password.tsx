import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

const UpdatePasswordScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {
    const isValid =
      newPassword.length > 0 &&
      confirmPassword.length > 0 &&
      newPassword === confirmPassword;
    setIsFormValid(isValid);
  }, [newPassword, confirmPassword]);

  const handleUpdatePassword = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      setLoading(false);

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Unexpected Error", err.message || "Something went wrong");
    }
  };

  const renderPasswordField = (
    placeholder: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    isVisible: boolean,
    toggleVisibility: () => void
  ) => (
    <View className="relative mb-4">
      <TextInput
        secureTextEntry={!isVisible}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        className="border border-gray-300 rounded-xl p-4 pr-12 text-base"
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={toggleVisibility}
        className="absolute right-4 top-4"
      >
        <Ionicons
          name={isVisible ? "eye-outline" : "eye-off-outline"}
          size={22}
          color="#888"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 justify-start px-6 pt-6 bg-gray-50">
      {renderPasswordField(
        "New Password",
        newPassword,
        setNewPassword,
        showNewPassword,
        () => setShowNewPassword(!showNewPassword)
      )}

      {renderPasswordField(
        "Confirm Password",
        confirmPassword,
        setConfirmPassword,
        showConfirmPassword,
        () => setShowConfirmPassword(!showConfirmPassword)
      )}

      <TouchableOpacity
        onPress={handleUpdatePassword}
        disabled={!isFormValid || loading}
        className={`rounded-xl p-4 items-center ${
          isFormValid && !loading ? "bg-blue-600" : "bg-gray-400"
        }`}
      >
        <Text className="text-white font-semibold">
          {loading ? "Updating..." : "Update Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdatePasswordScreen;
