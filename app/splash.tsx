import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
// import Auth from "@/components/Auth";
// import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function Splash() {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!user) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/(home)/(index)");
      }
      router.replace("/(auth)/login");
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="bg-white flex flex-col items-center justify-center w-full h-full">
      <Image source={require("@/assets/images/logo.png")} />
    </View>
  );
}
