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
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerShadowVisible: false,
          headerTitle: "",
          headerTitleAlign: "center",
          headerBackButtonDisplayMode: "default", // Remove back button from header

          headerLeft: () => (
            <TouchableOpacity className="px-2">
              <Ionicons name="chevron-back" size={28} color="#6b7280" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="activity"
        options={{
          headerShown: true,
          animation: "slide_from_right",
          title: "",
          headerTitleAlign: "center",
          headerBackButtonDisplayMode: "default",
          headerLeft: () => (
            <TouchableOpacity className="px-5">
              <Ionicons name="chevron-back" size={28} color="#6b7280" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="bookmarks"
        options={{
          headerShown: true,
          animation: "slide_from_right",
          title: "Bookmarks",
          headerTitleAlign: "center",
          headerBackButtonDisplayMode: "default",
          headerStyle: { backgroundColor: "#F9FAFB" },
          headerTintColor: "#000000",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={28} color="#6b7280" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="like"
        options={{
          headerShown: true,
          animation: "slide_from_right",
          title: "Liked",
          headerTitleAlign: "center",
          headerBackButtonDisplayMode: "default",
          headerStyle: { backgroundColor: "#F9FAFB" },
          headerTintColor: "#000000",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={28} color="#6b7280" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          animation: "slide_from_right",
          title: "",
          headerTitleAlign: "center",
          headerBackButtonDisplayMode: "default",
          headerStyle: { backgroundColor: "#F9FAFB" },
          headerTintColor: "#000000",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity className="px-5">
              <Ionicons name="chevron-back" size={28} color="#6b7280" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="password"
        options={{
          headerShown: true,
          animation: "slide_from_right",
          title: "",
          headerTitleAlign: "center",
          headerBackButtonDisplayMode: "default",
          headerStyle: { backgroundColor: "#F9FAFB" },
          headerTintColor: "#000000",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity className="px-5">
              <Ionicons name="chevron-back" size={28} color="#6b7280" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="place"
        options={{
          headerShown: false,
          headerTitle: "",
          headerStyle: { backgroundColor: "#F9FAFB" },
          headerTintColor: "#000000",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="review" options={{ headerShown: true }} />
    </Stack>
  );
}
