import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AddLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="addPlace"
        options={{
          headerShown: true,
          title: "Add Place",
          headerBackButtonDisplayMode: "default",
          presentation: "modal",
          animation: "fade_from_bottom",
          animationTypeForReplace: "pop",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000000",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // Light gray for border
    paddingLeft: 16, // Left padding
    paddingRight: 16, // Right padding
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8, // Spacing between icon and text
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937", // Dark gray
  },
  subText: {
    fontSize: 14,
    color: "#6b7280", // Medium gray
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
