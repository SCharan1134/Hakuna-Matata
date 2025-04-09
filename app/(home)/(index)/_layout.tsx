import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MapLayout() {
  const router = useRouter();
  const [location, setLocation] = useState("Hi-tech City");
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen name="review" options={{ headerShown: true }} />
      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "fade",
        }}
      />
    </Stack>
  );
}
